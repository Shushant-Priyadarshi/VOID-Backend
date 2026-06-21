import prisma from "../../utils/prisma.utils.js"

export const followRepository = {
  findFollow: async (followerId: string, followingId: string) => {
    return prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    })
  },

  create: async (followerId: string, followingId: string) => {
    return prisma.follow.create({ data: { followerId, followingId } })
  },

  delete: async (followerId: string, followingId: string) => {
    return prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    })
  },

  countFollowers: async (userId: string) => {
    return prisma.follow.count({ where: { followingId: userId } })
  },

  countFollowing: async (userId: string) => {
    return prisma.follow.count({ where: { followerId: userId } })
  },

  findFollowers: async (userId: string) => {
    return prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        follower: {
          select: { id: true, name: true, profileImage: true, role: true, college: true, hospital: true },
        },
      },
    })
  },

  findFollowing: async (userId: string) => {
    return prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        following: {
          select: { id: true, name: true, profileImage: true, role: true, college: true, hospital: true },
        },
      },
    })
  },

  findFollowingIds: async (followerId: string, targetIds: string[]) => {
    const rows = await prisma.follow.findMany({
      where: { followerId, followingId: { in: targetIds } },
      select: { followingId: true },
    })
    return new Set(rows.map((r) => r.followingId))
  },
}