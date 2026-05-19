import { z } from "zod";

export const accountSchema = z
  .object({
    firstname: z.string().trim().min(1, "This field is required"),
    lastname: z.string().trim().min(1, "This field is required"),
    email: z.string().trim().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "This field is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type AccountFormData = z.infer<typeof accountSchema>;
