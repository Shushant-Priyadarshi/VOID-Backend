import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.utils.js";
import { ApiResponse } from "../../utils/api-response.utils.js";
import { userService } from "./user.service.js";

export const userController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.id);

    res
      .status(200)
      .json(new ApiResponse(200, user, "Profile fetched successfully"));
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const { name, bio, profileImage, college, hospital } = req.body;

    const updated = await userService.updateProfile(req.user!.id, {
      name,
      bio,
      profileImage,
      college,
      hospital,
    });

    res
      .status(200)
      .json(new ApiResponse(200, updated, "Profile updated successfully"));
  }),

  getPublicProfile: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await userService.getPublicProfile(id);
    res
      .status(200)
      .json(new ApiResponse(200, user, "Profile fetched successfully"));
  }),

  searchUsers: asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.q as string) ?? "";
    const users = await userService.searchUsers(query);
    res.status(200).json(new ApiResponse(200, users, "Users found"));
  }),
};
