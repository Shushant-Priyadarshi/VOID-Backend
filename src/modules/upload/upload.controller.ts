import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler.utils.js"
import { ApiResponse } from "../../utils/api-response.utils.js"
import { ApiError } from "../../utils/api-error.utils.js"
import { uploadToR2 } from "../../utils/r2.utils.js"

export const uploadController = {
  uploadPostImages: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined

    if (!files || files.length === 0) {
      throw new ApiError(400, "At least one image is required")
    }

    if (files.length > 4) {
      throw new ApiError(400, "A post can have a maximum of 4 images")
    }

    const urls = await Promise.all(
      files.map((file) => uploadToR2(file.buffer, file.mimetype, "posts"))
    )

    res.status(200).json(new ApiResponse(200, { urls }, "Images uploaded successfully"))
  }),

  uploadAvatar: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File | undefined

    if (!file) {
      throw new ApiError(400, "An image is required")
    }

    const url = await uploadToR2(file.buffer, file.mimetype, "avatars")

    res.status(200).json(new ApiResponse(200, { url }, "Avatar uploaded successfully"))
  }),
}