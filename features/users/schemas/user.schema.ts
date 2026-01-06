import z from "zod";
import { ROLE_OPTIONS } from "@/features/users/role.types";

export const userSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Email is required"),
  role: z.enum(ROLE_OPTIONS, "Role is required"),
  password: z.string().min(6, "Password is required").optional(),
});
