import { userRepository } from "./user.repository.js";
import { ApiError } from "../../utils/api-error.utils.js";

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
    return userRepository.updateById(userId, data);
  },
};
