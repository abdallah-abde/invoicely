import z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(2, { error: "min" }),
  description: z.string().trim().optional(),
  unit: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(2, { error: "min" }),
  price: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(1, { error: "min" }),
});
