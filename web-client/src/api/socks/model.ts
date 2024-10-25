// src/api/socks/model.ts
import { z } from "zod";

// Define a schema for Sock Size
export const sockSizeEnumSchema = z.enum(["S", "M", "LG", "XL"]);
export type SockSize = z.infer<typeof sockSizeEnumSchema>;

// Define a schema for Sock Category
export const sockCategoryEnumSchema = z.enum(["Sports", "Casual", "Formal", "Winter"]);
export type SockCategory = z.infer<typeof sockCategoryEnumSchema>;

// Define the SockVariant schema
export const sockVariantSchema = z.object({
    id: z.number(),                      // Variant ID
    createdAt: z.string().optional(),     // Creation date
    price: z.number(),                    // Price for the variant
    quantity: z.number(),                 // Quantity available
    size: sockSizeEnumSchema,             // Size enum
});
export type SockVariant = z.infer<typeof sockVariantSchema>;

// Define the Sock schema
export const sockSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    description: z.string().optional(),
    previewImageUrl: z.string().url(),
    createdAt: z.string().optional(),
    variants: z.array(sockVariantSchema), // List of sock variants
});
export type Sock = z.infer<typeof sockSchema>;

// Paginated response schema for socks
export const socksPaginatedResponseSchema = z.object({
    items: z.array(sockSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
});
export type SocksPaginatedResponse = z.infer<typeof socksPaginatedResponseSchema>;

