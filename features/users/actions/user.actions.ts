"use server";

import { authSession } from "@/features/auth/lib/auth-utils";

import prisma from "@/lib/db/prisma";

export async function getUserProfile() {
  const session = await authSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      email: true,
      name: true,
      image: true,
      twoFactorEnabled: true,
    },
  });

  return user;
}
