import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler.utils.js"
import { ApiResponse } from "../../utils/api-response.utils.js"
import { userService } from "./user.service.js"

export const userController = {

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.id)

    res.status(200).json(
      new ApiResponse(200, user, "Profile fetched successfully")
    )
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const { name, bio, profileImage } = req.body

    const updated = await userService.updateProfile(req.user!.id, {
      name,
      bio,
      profileImage,
    })

    res.status(200).json(
      new ApiResponse(200, updated, "Profile updated successfully")
    )
  }),
}