import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./prisma.utils.js"  // import your existing prisma instance

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL as string],
})