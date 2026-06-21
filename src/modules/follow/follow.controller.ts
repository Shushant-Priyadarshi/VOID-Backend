import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler.utils.js"
import { ApiResponse } from "../../utils/api-response.utils.js"
import { followService } from "./follow.service.js"

export const followController = {
  follow: asyncHandler(async (req: Request, res: Response) => {
    const targetId = req.params.id as string
    const result = await followService.follow(req.user!.id, targetId)
    res.status(200).json(new ApiResponse(200, result, "Followed successfully"))
  }),

  unfollow: asyncHandler(async (req: Request, res: Response) => {
    const targetId = req.params.id as string
    const result = await followService.unfollow(req.user!.id, targetId)
    res.status(200).json(new ApiResponse(200, result, "Unfollowed successfully"))
  }),

  getCounts: asyncHandler(async (req: Request, res: Response) => {
    const targetId = req.params.id as string
    const viewerId = req.user?.id ?? null

    const [counts, isFollowing] = await Promise.all([
      followService.getFollowCounts(targetId),
      followService.isFollowing(viewerId, targetId),
    ])

    res.status(200).json(new ApiResponse(200, { ...counts, isFollowing }, "Follow counts fetched"))
  }),

  getFollowers: asyncHandler(async (req: Request, res: Response) => {
    const targetId = req.params.id as string
    const viewerId = req.user?.id ?? null

    const followers = await followService.getFollowersList(targetId, viewerId)
    res.status(200).json(new ApiResponse(200, followers, "Followers fetched"))
  }),

  getFollowing: asyncHandler(async (req: Request, res: Response) => {
    const targetId = req.params.id as string
    const viewerId = req.user?.id ?? null

    const following = await followService.getFollowingList(targetId, viewerId)
    res.status(200).json(new ApiResponse(200, following, "Following fetched"))
  }),
}