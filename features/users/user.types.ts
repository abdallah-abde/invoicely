import { User } from "@/app/generated/prisma/client";
import z from "zod";
import { userSchema } from "@/features/users/schemas/user.schema";

/*** USER NORMALIZE TYPES ***/
export interface UserPrismaPayload extends User {
  hasDeletePermission: boolean;
}

/* ---------- INPUT TYPES ---------- */

export type UserInput = z.infer<typeof userSchema>;

/* ---------- RESPONSE TYPES ---------- */

export type UserResponse = User;
