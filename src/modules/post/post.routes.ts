import { Router } from "express"
import { postController } from "./post.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"
import { optionalAuth } from "../../middlewares/optionalAuth.middleware.js"

const router = Router()

// public — viewable by anyone, but attaches user if logged in
router.get("/feed", optionalAuth, postController.getFeed)
router.get("/search", optionalAuth, postController.searchPosts)
router.get("/:id", optionalAuth, postController.getPostById)
// existing param routes below
router.get("/:id", optionalAuth, postController.getPostById)
router.get("/by-user/:id", optionalAuth, postController.getPublicPostsByUser)

// requires auth
router.post("/", requireAuth, postController.createPost)
router.post("/:id/like", requireAuth, postController.toggleLike)
router.delete("/:id", requireAuth, postController.deletePost)
router.post("/:id/comments", requireAuth, postController.addComment)
router.delete("/comments/:commentId", requireAuth, postController.deleteComment)
router.get("/mine/created", requireAuth, postController.getMyPosts)
router.get("/mine/liked", requireAuth, postController.getMyLikedPosts)
router.get("/mine/commented", requireAuth, postController.getMyCommentedPosts)



export default router