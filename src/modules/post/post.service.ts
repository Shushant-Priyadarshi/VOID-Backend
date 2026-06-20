import { postRepository } from "./post.repository.js";
import { ApiError } from "../../utils/api-error.utils.js";
import prisma from "../../utils/prisma.utils.js";

interface CreatePostInput {
  authorId: string;
  content: string;
  isAnonymous: boolean;
  imageUrl?: string;
}

export const postService = {
  createPost: async (input: CreatePostInput) => {
    if (input.isAnonymous && input.imageUrl) {
      throw new ApiError(400, "Anonymous posts cannot include an image");
    }

    let anonymousLabel: string | undefined;

    if (input.isAnonymous) {
      const user = await prisma.user.findUnique({
        where: { id: input.authorId },
        select: { role: true, college: true, hospital: true },
      });

      if (!user) throw new ApiError(404, "User not found");

      anonymousLabel = buildAnonymousLabel(
        user.role,
        user.college,
        user.hospital
      );
    }

    return postRepository.create({
      authorId: input.authorId,
      content: input.content,
      isAnonymous: input.isAnonymous,
      imageUrl: input.isAnonymous ? undefined : input.imageUrl,
      anonymousLabel,
    });
  },

  getFeed: async (userId: string | null, cursor?: string, limit = 10) => {
    const posts = await postRepository.findFeed({ cursor, limit });
    return attachLikeState(userId, posts);
  },

  getPostById: async (userId: string | null, postId: string) => {
    const post = await postRepository.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    const [withLikeState] = await attachLikeState(userId, [post]);
    return withLikeState;
  },

  searchPosts: async (userId: string | null, query: string) => {
    if (!query.trim()) return [];
    const posts = await postRepository.search(query, 20);
    return attachLikeState(userId, posts);
  },

  toggleLike: async (userId: string, postId: string) => {
    const post = await postRepository.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    const existing = await postRepository.findLikeByUserAndPost(userId, postId);

    if (existing) {
      await postRepository.deleteLike(userId, postId);
      return { liked: false };
    } else {
      await postRepository.createLike(userId, postId);
      return { liked: true };
    }
  },

  deletePost: async (userId: string, postId: string) => {
    const post = await postRepository.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");
    if (post.authorId !== userId)
      throw new ApiError(403, "Not allowed to delete this post");

    await postRepository.delete(postId);
  },

  getMyPosts: async (userId: string) => {
    const posts = await postRepository.findByAuthorId(userId, 50);
    return attachLikeState(userId, posts);
  },

  getMyLikedPosts: async (userId: string) => {
    const posts = await postRepository.findLikedByUserId(userId, 50);
    return attachLikeState(userId, posts);
  },

  getMyCommentedPosts: async (userId: string) => {
    const posts = await postRepository.findCommentedByUserId(userId, 50);
    return attachLikeState(userId, posts);
  },

  getPublicPostsByUser: async (viewerId: string | null, authorId: string) => {
  const posts = await postRepository.findByAuthorId(authorId, 50)
  const nonAnonymous = posts.filter((p) => !p.isAnonymous)
  return attachLikeState(viewerId, nonAnonymous)
},
};

function buildAnonymousLabel(
  role: string,
  college?: string | null,
  hospital?: string | null
): string {
  if (role === "MENTOR" && hospital) return `Doctor, ${hospital}`;
  if (college) return `Medical Student, ${college}`;
  return "Anonymous Member";
}

async function attachLikeState<
  T extends {
    id: string;
    isAnonymous: boolean;
    author: any;
    anonymousLabel: string | null;
    _count: { likes: number; comments: number };
  }
>(userId: string | null, posts: T[]) {
  const likedSet = userId
    ? await postRepository.findLikedPostIds(
        userId,
        posts.map((p) => p.id)
      )
    : new Set<string>();

  return posts.map((post) => ({
    id: post.id,
    content: (post as any).content,
    imageUrl: (post as any).imageUrl,
    isAnonymous: post.isAnonymous,
    createdAt: (post as any).createdAt,
    author: post.isAnonymous ? null : post.author,
    anonymousLabel: post.isAnonymous ? post.anonymousLabel : undefined,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    likedByMe: likedSet.has(post.id),
  }));
}
