import { z } from "zod";

export const adminSchema = z.object({
  id: z.number().optional(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  username: z.string(),
  passwordHash: z.string().optional(),
  createdAt: z.string().optional(),
});
export type Admin = z.infer<typeof adminSchema>;

export const adminsPaginatedSchema = z.object({
  items: z.array(adminSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});
export type AdminsPaginatedResponse = z.infer<typeof adminsPaginatedSchema>;

export const adminLoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type AdminLoginRequest = z.infer<typeof adminLoginRequestSchema>;

export const adminLoginResponseSchema = z.object({
  token: z.string(),
});
export type AdminLoginResponse = z.infer<typeof adminLoginResponseSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  admin: adminSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
