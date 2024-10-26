import { z } from 'zod';

export const sockVariantSchema = z.object({
  size: z.enum(['S', 'M', 'LG', 'XL']),
  price: z.number(),
  quantity: z.number(),
});

export const sockSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  preview_image_url: z.string(), 
  variants: z.array(sockVariantSchema), 
});

export type Sock = z.infer<typeof sockSchema>;
export type SockVariant = z.infer<typeof sockVariantSchema>;
