import { commentRepository } from "./comment.repository.js"
import { ApiError } from "../../utils/api-error.utils.js"

interface FlatComment {
  id: string
  content: string
  authorId: string
  parentId: string | null
  createdAt: Date
  author: { id: string; name: string; profileImage: string | null }
}

interface NestedComment extends FlatComment {
  replies: NestedComment[]
}

export const commentService = {
  addComment: async (userId: string, postId: string, content: string, parentId?: string) => {
    if (parentId) {
      const parent = await commentRepository.findById(parentId)
      if (!parent || parent.postId !== postId) {
        throw new ApiError(400, "Invalid parent comment")
      }
    }

    return commentRepository.create({ authorId: userId, postId, content, parentId })
  },

  getCommentsForPost: async (postId: string): Promise<NestedComment[]> => {
    const flat = await commentRepository.findByPostId(postId) as FlatComment[]
    return nestComments(flat)
  },

  deleteComment: async (userId: string, commentId: string) => {
    const comment = await commentRepository.findById(commentId)
    if (!comment) throw new ApiError(404, "Comment not found")
    if (comment.authorId !== userId) throw new ApiError(403, "Not allowed to delete this comment")

    await commentRepository.softDelete(commentId)
  },
}

function nestComments(flat: FlatComment[]): NestedComment[] {
  const map = new Map<string, NestedComment>()
  const roots: NestedComment[] = []

  for (const c of flat) {
    map.set(c.id, { ...c, replies: [] })
  }

  for (const c of flat) {
    const node = map.get(c.id)!
    if (c.parentId) {
      const parent = map.get(c.parentId)
      if (parent) parent.replies.push(node)
      else roots.push(node)  // orphaned, fallback to root
    } else {
      roots.push(node)
    }
  }

  return roots
}