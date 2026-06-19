import { UserRole } from "../generated/prisma/client.js"

// better-auth's session user only has base fields
// we extend it with our custom fields
export interface AuthUser {
  id: string
  email: string
  name: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  // your custom fields
  bio?: string | null
  profileImage?: string | null
  role?: UserRole
}

export interface AuthSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
  updatedAt: Date
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
      session?: AuthSession
    }
  }
}