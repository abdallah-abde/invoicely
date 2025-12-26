import z from "zod";

export const ROLE_OPTIONS = ["user", "admin"] as const;
export type Role = (typeof ROLE_OPTIONS)[number];

export const userSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Email is required"),
  role: z.enum(ROLE_OPTIONS, "Role is required"),
  password: z.string().min(6, "Password is required").optional(),
});
