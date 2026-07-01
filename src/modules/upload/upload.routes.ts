import { Router } from "express"
import { uploadController } from "./upload.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"
import { uploadImages, uploadSingleImage } from "../../middlewares/multer.middleware.js"

const router = Router()

router.post("/post-images", requireAuth, uploadImages, uploadController.uploadPostImages)
router.post("/avatar", requireAuth, uploadSingleImage, uploadController.uploadAvatar)

export default router