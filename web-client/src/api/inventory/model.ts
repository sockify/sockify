import { z } from "zod";

// SockSize Enum
export const sockSizeEnumSchema = z.enum(["S", "M", "LG", "XL"]);
export type SockSize = z.infer<typeof sockSizeEnumSchema>;

// SockCategory Enum
export const sockCategoryEnumSchema = z.enum([
  "Sports",
  "Casual",
  "Formal",
  "Winter",
]);
export type SockCategory = z.infer<typeof sockCategoryEnumSchema>;

// SockVariant Schema
export const sockVariantSchema = z.object({
  id: z.number().optional(),
  size: sockSizeEnumSchema,
  price: z.number().positive().max(100),
  quantity: z.number().int().min(0),
  createdAt: z.string().optional(),
});
export type SockVariant = z.infer<typeof sockVariantSchema>;

// SockMetadata Schema for Sock Details
export const sockMetadataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  previewImageUrl: z.string().url("Invalid URL format"),
});
export type SockMetadata = z.infer<typeof sockMetadataSchema>;

// Sock Schema
export const sockSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string(),
  previewImageUrl: z.string(),
  variants: z.array(sockVariantSchema),
});
export type Sock = z.infer<typeof sockSchema>;

// Paginated Response Schema for Socks
export const socksPaginatedResponseSchema = z.object({
  items: z.array(sockSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});
export type SocksPaginatedResponse = z.infer<typeof socksPaginatedResponseSchema>;

// Similar Sock Schema
export const similarSockSchema = z.object({
  sockId: z.number(),
  name: z.string(),
  price: z.number(),
  previewImageUrl: z.string(),
  createdAt: z.string(),
});
export type SimilarSock = z.infer<typeof similarSockSchema>;
export const similarSockListSchema = z.array(similarSockSchema);

// CreateSockRequest Schema
export const createSockRequestSchema = z.object({
  sock: sockMetadataSchema,
  variants: z.array(sockVariantSchema),
});
export type CreateSockRequest = z.infer<typeof createSockRequestSchema>;

// CreateSockResponse Schema
export const createSockResponseSchema = z.object({
  sockId: z.number(),
});
export type CreateSockResponse = z.infer<typeof createSockResponseSchema>;
export const availableSizes = sockSizeEnumSchema.options; // Runtime array of sizes
