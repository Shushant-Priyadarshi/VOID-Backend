import { Router } from "express"
import { followController } from "./follow.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"
import { optionalAuth } from "../../middlewares/optionalAuth.middleware.js"

const router = Router()

router.post("/:id/follow", requireAuth, followController.follow)
router.delete("/:id/follow", requireAuth, followController.unfollow)
router.get("/:id/follow-counts", optionalAuth, followController.getCounts)
router.get("/:id/followers", optionalAuth, followController.getFollowers)
router.get("/:id/following", optionalAuth, followController.getFollowing)

export default router