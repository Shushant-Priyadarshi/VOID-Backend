import { Router } from "express"
import { userController } from "./user.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"

const router = Router()

router.get("/me", requireAuth, userController.getProfile)
router.patch("/update-user-profile", requireAuth, userController.updateProfile)

export default router