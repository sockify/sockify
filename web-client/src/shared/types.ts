import { z } from "zod";

export const serverMessageSchema = z.object({
  message: z.string(),
});
export type ServerMessage = z.infer<typeof serverMessageSchema>;
