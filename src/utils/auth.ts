import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.utils.js";
import { SendEmail } from "./sendEmail.utils.js";
import { EmailTemplate } from "./emailTemplate.js";

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
        EmailTemplate({
          title: "Reset Password",
          message:
            "We received a request to reset your password. Click the button below to continue.",
          buttonText: "Reset Password",
          buttonUrl: resetUrl,
        })
      );
    },
    onPasswordReset: async ({ user }, request) => {
      await SendEmail(
        user.email,
        "Password changed successfully",
        EmailTemplate({
          title: "Password Updated",
          message: `
      Your password was successfully changed.

      Account: ${user.email}

      If you didn't perform this action, please contact support immediately.
    `,
        })
      );
    },
    onExistingUserSignUp: async ({ user }) => {
      await SendEmail(
        user.email,
        "Account already exists",
        EmailTemplate({
          title: "Sign-up Attempt Detected",
          message: `
      Someone attempted to create a new account using this email address.

      If this was you, simply sign in instead.

      If this wasn't you, no action is required.
    `,
        })
      );
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const verifyUrl = `${process.env.FRONTEND_URL}/email-verified?token=${token}`;
      await SendEmail(
        user.email,
        "Verify your email",
        EmailTemplate({
          title: "Verify your email",
          message:
            "Welcome to Voice Of Indian Doctors. Please verify your email address to activate your account.",
          buttonText: "Verify Email",
          buttonUrl: verifyUrl,
        })
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
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days total session lifetime
    updateAge: 60 * 60 * 24,
  },
});
