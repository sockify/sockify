import { z } from "zod";

export const sockSizeEnumSchema = z.enum(["S", "M", "LG", "XL"]);
export type SockSize = z.infer<typeof sockSizeEnumSchema>;

export const sockCategoryEnumSchema = z.enum([
  "Sports",
  "Casual",
  "Formal",
  "Winter",
]);
export type SockCategory = z.infer<typeof sockCategoryEnumSchema>;

export const sockVariantSchema = z.object({
  id: z.number().optional(),
  size: sockSizeEnumSchema,
  price: z.number(),
  quantity: z.number(),
  createdAt: z.string().optional(),
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

export const socksPaginatedResponseSchema = z.object({
  items: z.array(sockSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});
export type SocksPaginatedResponse = z.infer<
  typeof socksPaginatedResponseSchema
>;

export const similarSockSchema = z.object({
  sockId: z.number(),
  name: z.string(),
  price: z.number(),
  previewImageUrl: z.string(),
  createdAt: z.string(),
});
export type SimilarSock = z.infer<typeof similarSockSchema>;
export const similarSockListSchema = z.array(similarSockSchema);
