import { z } from "zod";

export const adminSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  passwordHash: z.string().optional(),
  createdAt: z.string(),
});
export const adminsSchema = z.array(adminSchema);
export type Admin = z.infer<typeof adminSchema>;
