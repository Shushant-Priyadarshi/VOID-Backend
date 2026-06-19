import { Request, Response, NextFunction } from "express"
import { auth } from "../utils/auth.js"
import { fromNodeHeaders } from "better-auth/node"
import {AuthSession } from "../types/express.js"

import prisma from "../utils/prisma.utils.js"

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // fetch full user with your custom fields
  const fullUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!fullUser) {
    return res.status(401).json({ error: "User not found" })
  }

  req.user = fullUser
  req.session = session.session as AuthSession

  next()
}