import z from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Name is required",
  }),
  description: z.string().trim().min(2, {
    message: "Description is required",
  }),
  unit: z.string().trim().min(2, {
    message: "Unit is required",
  }),
  price: z.string().trim().min(1, {
    message: "Price is required",
  }),
});
