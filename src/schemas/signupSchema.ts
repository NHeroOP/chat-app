import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, "Username must be atleast 5 characters long")
  .max(16, "Username must not exceed 16 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({message: "Invalid email"}),
  password: z.string().min(6, {message: "Password must be atleast 6 characters long"})
})