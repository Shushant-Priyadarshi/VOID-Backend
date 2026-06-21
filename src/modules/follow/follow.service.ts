import { followRepository } from "./follow.repository.js"
import { ApiError } from "../../utils/api-error.utils.js"
import prisma from "../../utils/prisma.utils.js"

export const followService = {
  follow: async (followerId: string, followingId: string) => {
    if (followerId === followingId) {
      throw new ApiError(400, "You cannot follow yourself")
    }

    const targetUser = await prisma.user.findUnique({ where: { id: followingId } })
    if (!targetUser) throw new ApiError(404, "User not found")

    const existing = await followRepository.findFollow(followerId, followingId)
    if (existing) {
      throw new ApiError(409, "Already following this user")
    }

    await followRepository.create(followerId, followingId)
    return { following: true }
  },

  unfollow: async (followerId: string, followingId: string) => {
    const existing = await followRepository.findFollow(followerId, followingId)
    if (!existing) {
      throw new ApiError(409, "You are not following this user")
    }

    await followRepository.delete(followerId, followingId)
    return { following: false }
  },

  getFollowCounts: async (userId: string) => {
    const [followers, following] = await Promise.all([
      followRepository.countFollowers(userId),
      followRepository.countFollowing(userId),
    ])
    return { followers, following }
  },

  isFollowing: async (followerId: string | null, followingId: string) => {
    if (!followerId) return false
    const existing = await followRepository.findFollow(followerId, followingId)
    return !!existing
  },

  getFollowersList: async (userId: string, viewerId: string | null) => {
    const rows = await followRepository.findFollowers(userId)
    const users = rows.map((r) => r.follower)
    return attachFollowingState(viewerId, users)
  },

  getFollowingList: async (userId: string, viewerId: string | null) => {
    const rows = await followRepository.findFollowing(userId)
    const users = rows.map((r) => r.following)
    return attachFollowingState(viewerId, users)
  },
}

async function attachFollowingState<T extends { id: string }>(viewerId: string | null, users: T[]) {
  if (!viewerId) {
    return users.map((u) => ({ ...u, isFollowedByMe: false }))
  }

  const followingIds = await followRepository.findFollowingIds(viewerId, users.map((u) => u.id))
  return users.map((u) => ({ ...u, isFollowedByMe: followingIds.has(u.id) }))
}