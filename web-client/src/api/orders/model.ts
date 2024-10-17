import { z } from "zod";

export const orderSchema = z.object({
  invoiceNumber: z.string(),
  total: z.number(),
  status: z.string(),
});

export type Order = z.infer<typeof orderSchema>;
