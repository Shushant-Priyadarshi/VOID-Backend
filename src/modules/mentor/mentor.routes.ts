import { Router } from "express"
import { mentorController } from "./mentor.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"

const router = Router()

// public — anyone can browse mentors
router.get("/", mentorController.listMentors)
router.get("/categories", mentorController.getCategories)
router.get("/user/:userId", mentorController.getMentorByUserId)

// requires auth
router.post("/", requireAuth, mentorController.becomeMentor)
router.patch("/", requireAuth, mentorController.updateMentorProfile)
router.get("/me", requireAuth, mentorController.getMyMentorProfile)

export default router