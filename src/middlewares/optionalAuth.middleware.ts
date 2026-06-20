import { Request, Response, NextFunction } from "express"
import { auth } from "../utils/auth.js"
import { fromNodeHeaders } from "better-auth/node"
import prisma from "../utils/prisma.utils.js"

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (session) {
    const fullUser = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (fullUser) {
      req.user = fullUser
      req.session = session.session as any
    }
  }

  next()
}