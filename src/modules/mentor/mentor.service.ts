import { mentorRepository } from "./mentor.repository.js"
import { ApiError } from "../../utils/api-error.utils.js"
import prisma from "../../utils/prisma.utils.js"
import { MentorCategory } from "../../generated/prisma/client.js"

interface CreateMentorInput {
  userId: string
  category: MentorCategory
  specialization: string
  experienceYears: number
  organization?: string
  consultationFee?: number
  about?: string
}

export const mentorService = {
  becomeMentor: async (input: CreateMentorInput) => {
    const existing = await mentorRepository.findByUserId(input.userId)
    if (existing) {
      throw new ApiError(409, "You already have a mentor profile")
    }

    const mentorProfile = await mentorRepository.create(input)

    // promote role to MENTOR so it reflects across the app (anonymous labels, badges, etc.)
    await prisma.user.update({
      where: { id: input.userId },
      data: { role: "MENTOR" },
    })

    return mentorProfile
  },

  updateMentorProfile: async (userId: string, data: Partial<Omit<CreateMentorInput, "userId">> & { bookingUrl?: string }) => {
    const existing = await mentorRepository.findByUserId(userId)
    if (!existing) {
      throw new ApiError(404, "Mentor profile not found")
    }
    return mentorRepository.update(userId, data)
  },

  getMyMentorProfile: async (userId: string) => {
    return mentorRepository.findByUserId(userId)
  },

  getMentorProfileByUserId: async (userId: string) => {
    const profile = await mentorRepository.findByUserId(userId)
    if (!profile) throw new ApiError(404, "Mentor profile not found")
    return profile
  },

  listMentors: async (category?: MentorCategory, search?: string) => {
    return mentorRepository.findMany({ category, search, limit: 50 })
  },
}