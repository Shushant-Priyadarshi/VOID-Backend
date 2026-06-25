import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler.utils.js"
import { ApiResponse } from "../../utils/api-response.utils.js"
import { ApiError } from "../../utils/api-error.utils.js"
import { mentorService } from "./mentor.service.js"
import { MentorCategory } from "../../generated/prisma/client.js"

const VALID_CATEGORIES = Object.values(MentorCategory)

export const mentorController = {
  becomeMentor: asyncHandler(async (req: Request, res: Response) => {
    const { category, specialization, experienceYears, organization, consultationFee, about } = req.body

    if (!category || !VALID_CATEGORIES.includes(category)) {
      throw new ApiError(400, "Valid category is required", [`category must be one of: ${VALID_CATEGORIES.join(", ")}`])
    }

    if (!specialization || typeof specialization !== "string") {
      throw new ApiError(400, "Specialization is required")
    }

    if (experienceYears === undefined || Number(experienceYears) < 0) {
      throw new ApiError(400, "Valid years of experience is required")
    }

    const profile = await mentorService.becomeMentor({
      userId: req.user!.id,
      category,
      specialization,
      experienceYears: Number(experienceYears),
      organization,
      consultationFee: consultationFee ? Number(consultationFee) : undefined,
      about,
    })

    res.status(201).json(new ApiResponse(201, profile, "Mentor profile created successfully"))
  }),

  updateMentorProfile: asyncHandler(async (req: Request, res: Response) => {
    const { category, specialization, experienceYears, organization, consultationFee, about, bookingUrl } = req.body

    if (category && !VALID_CATEGORIES.includes(category)) {
      throw new ApiError(400, "Invalid category")
    }

    const profile = await mentorService.updateMentorProfile(req.user!.id, {
      category,
      specialization,
      experienceYears: experienceYears !== undefined ? Number(experienceYears) : undefined,
      organization,
      consultationFee: consultationFee !== undefined ? Number(consultationFee) : undefined,
      about,
      bookingUrl,
    })

    res.status(200).json(new ApiResponse(200, profile, "Mentor profile updated successfully"))
  }),

  getMyMentorProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await mentorService.getMyMentorProfile(req.user!.id)
    res.status(200).json(new ApiResponse(200, profile, "Mentor profile fetched"))
  }),

  getMentorByUserId: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId as string
    const profile = await mentorService.getMentorProfileByUserId(userId)
    res.status(200).json(new ApiResponse(200, profile, "Mentor profile fetched"))
  }),

  listMentors: asyncHandler(async (req: Request, res: Response) => {
    const category = req.query.category as MentorCategory | undefined
    const search = req.query.search as string | undefined

    const mentors = await mentorService.listMentors(category, search)
    res.status(200).json(new ApiResponse(200, mentors, "Mentors fetched"))
  }),

  getCategories: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse(200, VALID_CATEGORIES, "Categories fetched"))
  }),
}