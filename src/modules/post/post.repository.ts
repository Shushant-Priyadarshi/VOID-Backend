import prisma from "../../utils/prisma.utils.js";

export const postRepository = {
  create: async (data: {
    authorId: string;
    title:string;
    content: string;
    isAnonymous: boolean;
    imageUrls?: string[]
    anonymousLabel?: string;
  }) => {
    return prisma.post.create({
      data,
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
      },
    });
  },

  findFeed: async (params: { cursor?: string; limit: number }) => {
    return prisma.post.findMany({
      take: params.limit,
      ...(params.cursor && {
        skip: 1,
        cursor: { id: params.cursor },
      }),
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, profileImage: true, image:true} },
        _count: { select: { likes: true, comments: true } },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, profileImage: true , image:true} },
        _count: { select: { likes: true, comments: true } },
      },
    });
  },

  search: async (query: string, limit: number) => {
    return prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.post.delete({ where: { id } });
  },

  findLikeByUserAndPost: async (userId: string, postId: string) => {
    return prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
  },

  createLike: async (userId: string, postId: string) => {
    return prisma.like.create({ data: { userId, postId } });
  },

  deleteLike: async (userId: string, postId: string) => {
    return prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
  },

  findLikedPostIds: async (userId: string, postIds: string[]) => {
    const likes = await prisma.like.findMany({
      where: { userId, postId: { in: postIds } },
      select: { postId: true },
    });
    return new Set(likes.map((l) => l.postId));
  },

  findByAuthorId: async (authorId: string, limit: number) => {
    return prisma.post.findMany({
      where: { authorId },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  },

  findLikedByUserId: async (userId: string, limit: number) => {
    const likes = await prisma.like.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            author: { select: { id: true, name: true, profileImage: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
    });
    return likes.map((l) => l.post);
  },

  findCommentedByUserId: async (userId: string, limit: number) => {
    // distinct posts the user has commented on, most recent comment first
    const comments = await prisma.comment.findMany({
      where: { authorId: userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      distinct: ["postId"],
      take: limit,
      include: {
        post: {
          include: {
            author: { select: { id: true, name: true, profileImage: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
    });
    return comments.map((c) => c.post);
  },
};
