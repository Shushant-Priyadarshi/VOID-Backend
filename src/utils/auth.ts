import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.utils.js";
import { SendEmail } from "./sendEmail.utils.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true, 
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await SendEmail(
        user.email,
        "Reset your password",
        `<p>Hi ${user.name},</p>
         <p>Click the link below to reset your password:</p>
         <p><a href="${resetUrl}">Reset Password</a></p>
         <p>If you didn't request this, ignore this email.</p>`
      );
    },
    onPasswordReset: async ({ user }, request) => {
      await SendEmail(
        user.email,
        "Password Change",
        `<p>Hi ${user.name},</p>
         <p>You password has been changed for the email ${user.email}</p>
         `
      );
    },
    onExistingUserSignUp: async ({ user }) => {
      await SendEmail(
        user.email,
        "Sign-up attempt with your email",
        `<p>Hi ${user.name},</p>
         <p>Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.</p>
         `
      );
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const verifyUrl = `${process.env.FRONTEND_URL}/email-verified?token=${token}`;
      await SendEmail(
        user.email,
        "Verify your email",
        `<p>Hi ${user.name},</p>
         <p>Click the link below to verify your email:</p>
         <p><a href="${verifyUrl}">Verify Email</a></p>`
      );
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL as string],
});
