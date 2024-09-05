import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.enum(["admin", "member"]),
  createdAt: z.string(),
});
export const usersSchema = z.array(userSchema);
export type User = z.infer<typeof userSchema>;
