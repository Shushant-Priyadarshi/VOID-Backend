import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.utils.js";
import { ApiResponse } from "../../utils/api-response.utils.js";
import { ApiError } from "../../utils/api-error.utils.js";
import { postService } from "./post.service.js";
import { commentService } from "./comment.service.js";

export const postController = {
  createPost: asyncHandler(async (req: Request, res: Response) => {
    const { title, content, isAnonymous, imageUrls } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      throw new ApiError(400, "Post title is required");
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      throw new ApiError(400, "Post content is required");
    }

    if (imageUrls && (!Array.isArray(imageUrls) || imageUrls.length > 4)) {
      throw new ApiError(400, "imageUrls must be an array of at most 4 URLs");
    }

    const post = await postService.createPost({
      authorId: req.user!.id,
      title: title.trim(),
      content: content.trim(),
      isAnonymous: !!isAnonymous,
      imageUrls,
    });

    res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  }),
  
  getFeed: asyncHandler(async (req: Request, res: Response) => {
    const cursor = req.query.cursor as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const userId = req.user?.id ?? null;

    const posts = await postService.getFeed(userId, cursor, limit);

    res
      .status(200)
      .json(new ApiResponse(200, posts, "Feed fetched successfully"));
  }),

  getPostById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.id ?? null;

    const post = await postService.getPostById(userId, id);
    const comments = await commentService.getCommentsForPost(id);

    res
      .status(200)
      .json(
        new ApiResponse(200, { post, comments }, "Post fetched successfully")
      );
  }),

  searchPosts: asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.q as string) ?? "";
    const userId = req.user?.id ?? null;

    const posts = await postService.searchPosts(userId, query);

    res.status(200).json(new ApiResponse(200, posts, "Search results fetched"));
  }),

  toggleLike: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result = await postService.toggleLike(req.user!.id, id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          result.liked ? "Post liked" : "Post unliked"
        )
      );
  }),

  deletePost: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await postService.deletePost(req.user!.id, id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  }),

  addComment: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { content, parentId } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      throw new ApiError(400, "Comment content is required");
    }

    const comment = await commentService.addComment(
      req.user!.id,
      id,
      content.trim(),
      parentId
    );

    res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment added successfully"));
  }),

  deleteComment: asyncHandler(async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;

    await commentService.deleteComment(req.user!.id, commentId);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Comment deleted successfully"));
  }),

  getMyPosts: asyncHandler(async (req: Request, res: Response) => {
    const posts = await postService.getMyPosts(req.user!.id);
    res.status(200).json(new ApiResponse(200, posts, "Your posts fetched"));
  }),

  getMyLikedPosts: asyncHandler(async (req: Request, res: Response) => {
    const posts = await postService.getMyLikedPosts(req.user!.id);
    res.status(200).json(new ApiResponse(200, posts, "Liked posts fetched"));
  }),

  getMyCommentedPosts: asyncHandler(async (req: Request, res: Response) => {
    const posts = await postService.getMyCommentedPosts(req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, posts, "Commented posts fetched"));
  }),

  getPublicPostsByUser: asyncHandler(async (req: Request, res: Response) => {
    const authorId = req.params.id as string;
    const viewerId = req.user?.id ?? null;

    const posts = await postService.getPublicPostsByUser(viewerId, authorId);

    res.status(200).json(new ApiResponse(200, posts, "User posts fetched"));
  }),
};
