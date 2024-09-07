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
export const adminsSchema = z.array(adminSchema);
export type Admin = z.infer<typeof adminSchema>;
