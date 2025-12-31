import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, twoFactor } from "better-auth/plugins";

import prisma from "@/lib/db/prisma";
import { ac, roles } from "@/features/auth/lib/permissions";

import { sendVerificationEmail } from "@/features/auth/services/emails/send-verification-email";
import { sendOtpEmail } from "@/features/auth/services/emails/send-otp-email";
import { sendResetPasswordEmail } from "@/features/auth/services/emails/send-reset-password-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({
        to: process.env.EMAIL_TO!, // user.email
        url,
      });
    },
  },

  rateLimit: {
    enabled: true,
    window: 10,
    max: 2,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 900, // 15 minutes
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: process.env.EMAIL_TO!, // user.email
        verificationUrl: url,
        username: user.name,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },

  plugins: [
    admin({
      ac,
      roles,
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
    }),
    nextCookies(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          sendOtpEmail({ to: process.env.EMAIL_TO!, otp }); // user.email
        },
      },
    }),
  ],
});

// TODO: on Production: change (to) parameter in send Verification Email function
// TODO: skipVerificationOnEnable: false (work on it)
