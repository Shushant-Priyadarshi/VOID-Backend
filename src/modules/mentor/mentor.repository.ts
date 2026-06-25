import prisma from "../../utils/prisma.utils.js"
import { MentorCategory } from "../../generated/prisma/client.js"

export const mentorRepository = {
  findByUserId: async (userId: string) => {
    return prisma.mentorProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, profileImage: true, bio: true, college: true, hospital: true } },
      },
    })
  },

  create: async (data: {
    userId: string
    category: MentorCategory
    specialization: string
    experienceYears: number
    organization?: string
    consultationFee?: number
    about?: string
  }) => {
    return prisma.mentorProfile.create({
      data,
      include: {
        user: { select: { id: true, name: true, profileImage: true, bio: true, college: true, hospital: true } },
      },
    })
  },

  update: async (userId: string, data: Partial<{
    category: MentorCategory
    specialization: string
    experienceYears: number
    organization: string
    consultationFee: number
    about: string
    bookingUrl: string
  }>) => {
    return prisma.mentorProfile.update({
      where: { userId },
      data,
      include: {
        user: { select: { id: true, name: true, profileImage: true, bio: true, college: true, hospital: true } },
      },
    })
  },

  findMany: async (params: { category?: MentorCategory; search?: string; limit: number }) => {
    return prisma.mentorProfile.findMany({
      where: {
        ...(params.category && { category: params.category }),
        ...(params.search && {
          OR: [
            { specialization: { contains: params.search, mode: "insensitive" } },
            { organization: { contains: params.search, mode: "insensitive" } },
            { user: { name: { contains: params.search, mode: "insensitive" } } },
          ],
        }),
      },
      take: params.limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, profileImage: true, bio: true, college: true, hospital: true } },
      },
    })
  },
}