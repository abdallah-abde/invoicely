"use server";

import { authSession } from "@/features/auth/lib/auth-utils";

import { UTApi } from "uploadthing/server";
import { authClient } from "../lib/auth-client";
import prisma from "@/lib/db/prisma";

const utapi = new UTApi();

export async function deleteUserProfileImage(url: string) {
  const session = await authSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await utapi.deleteFiles(url.split("/f/")[1]);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: "" },
    });
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
