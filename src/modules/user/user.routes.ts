import { Router } from "express"
import { userController } from "./user.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"

const router = Router()

router.get("/me", requireAuth, userController.getProfile)
router.patch("/update-user-profile", requireAuth, userController.updateProfile)
router.get("/:id/public", userController.getPublicProfile)
router.get("/search", userController.searchUsers)
export default router