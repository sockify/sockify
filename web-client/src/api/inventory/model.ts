import { z } from "zod";

export const sockSizeEnumSchema = z.enum(["S", "M", "LG", "XL"]);
export type SockSize = z.infer<typeof sockSizeEnumSchema>;

export const sockVariantSchema = z.object({
  id: z.number().optional(),
  size: sockSizeEnumSchema,
  price: z.number(),
  quantity: z.number(),
});
export type SockVariant = z.infer<typeof sockVariantSchema>;

export const sockSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string(),
  previewImageUrl: z.string(),
  variants: z.array(sockVariantSchema),
});
export type Sock = z.infer<typeof sockSchema>;
