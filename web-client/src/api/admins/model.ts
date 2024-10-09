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
