import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Name is required",
  }),
  email: z.email({
    message: "Email is required",
  }),
  phone: z.string().trim().min(9, {
    message: "Phone is required",
  }),
  address: z.string().trim().min(2, {
    message: "Address is required",
  }),
  companyName: z.string().optional(),
  taxNumber: z.string().trim().min(2, {
    message: "Tax Number is required",
  }),
});
