import z from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(2, { error: "min" }),
  email: z.string().nonempty({ error: "required" }).email({
    error: "email",
  }),
  phone: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(9, { error: "min" }),
  address: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(2, { error: "min" }),
  companyName: z.string(),
  taxNumber: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(2, { error: "min" }),
});
