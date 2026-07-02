import prisma from "../../utils/prisma.utils.js";

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
        college: true,
        hospital: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  },

  updateById: async (
    id: string,
    data: {
      name?: string;
      bio?: string;
      profileImage?: string;
      college?: string;
      hospital?: string;
    }
  ) => {
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
        college: true,
        hospital: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  },

  findPublicById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        bio: true,
        profileImage: true,
        role: true,
        college: true,
        hospital: true,
        createdAt: true,
        // deliberately exclude: email, emailVerified
      },
    });
  },

  searchUsers: async (query: string, limit: number) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { college: { contains: query, mode: "insensitive" } },
        { hospital: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    select: {
      id: true,
      name: true,
      profileImage: true,
      role: true,
      college: true,
      hospital: true,
      bio: true,
      image:true
    },
  })
},
};
