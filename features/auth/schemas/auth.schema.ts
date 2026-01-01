import z from "zod";

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Enter a valid password."),
    currentPassword: z.string().min(6, "Enter a valid password."),
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    error: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const signInSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(6, "Enter a valid password."),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Enter a valid name."),
    email: z.email("Enter a valid email."),
    password: z.string().min(6, "Enter a valid password."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  email: z.email("Enter a valid email."),
  name: z.string().min(3, "Enter a valid name."),
});

export const profileImageSchema = z.object({
  image: z.string("Image is required."),
});

export const toggleOTPSchema = z.object({
  password: z.string().min(6, "Enter a valid password."),
});

export const oTPCodeSchema = z.object({
  code: z.string().min(6, "Enter a valid code."),
});

export const requestPasswordSchema = z.object({
  email: z.email("Enter a valid email."),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Enter a valid password."),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
