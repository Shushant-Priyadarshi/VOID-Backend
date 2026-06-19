import prisma from "../../utils/prisma.utils.js"

export const userRepository = {
  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        // never return passwordHash or sensitive fields
      },
    })
  },

  updateById: async (id: string, data: {
    name?: string
    bio?: string
    profileImage?: string
  }) => {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    })
  },
}