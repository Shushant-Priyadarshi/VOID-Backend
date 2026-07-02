import { userRepository } from "./user.repository.js";
import { ApiError } from "../../utils/api-error.utils.js";
import { deleteFromR2 } from "../../utils/r2.utils.js";

export const userService = {
  getProfile: async (userId: string) => {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },
  getPublicProfile: async (userId: string) => {
    const user = await userRepository.findPublicById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },

  updateProfile: async (
    userId: string,
    data: {
      name?: string;
      bio?: string;
      profileImage?: string;
      college?: string;
      hospital?: string;
    }
  ) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const oldImageUrl = user.profileImage;
    const isReplacingImage =
      data.profileImage && data.profileImage !== oldImageUrl;

    const updated = await userRepository.updateById(userId, data);

    // delete the old avatar from R2 only after the new one is successfully saved
    if (isReplacingImage && oldImageUrl) {
      deleteFromR2(oldImageUrl).catch((err) => {
        console.error("Failed to delete old avatar from R2:", err);
      });
    }

    return updated;
  },

  searchUsers: async (query: string) => {
    if (!query.trim()) return [];
    return userRepository.searchUsers(query, 10);
  },
};
