import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";

import prisma from "@/lib/prisma";

import { sendVerificationEmail } from "@/lib/send-verification-email";
import { sendOtpEmail } from "@/lib/send-otp-email";
import { sendResetPasswordEmail } from "@/lib/send-reset-password-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({
        to: process.env.EMAIL_TO!,
        subject: "Reset your password",
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
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: process.env.EMAIL_TO!,
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
    nextCookies(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          sendOtpEmail({ to: process.env.EMAIL_TO!, otp });
        },
      },
    }),
  ],
});

// TODO: on Production: change (to) parameter in send Verification Email function
// TODO: skipVerificationOnEnable: false (work on it)
