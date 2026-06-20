import prisma from "../../utils/prisma.utils.js"

export const commentRepository = {
  create: async (data: { authorId: string; postId: string; content: string; parentId?: string }) => {
    return prisma.comment.create({
      data,
      include: { author: { select: { id: true, name: true, profileImage: true } } },
    })
  },

  // fetch all comments for a post (flat), we nest them in the service layer
  findByPostId: async (postId: string) => {
    return prisma.comment.findMany({
      where: { postId, deletedAt: null },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true, profileImage: true } } },
    })
  },

  findById: async (id: string) => {
    return prisma.comment.findUnique({ where: { id } })
  },

  softDelete: async (id: string) => {
    return prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date(), content: "[deleted]" },
    })
  },
}