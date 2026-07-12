import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required")
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});