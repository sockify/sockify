import { z } from "zod";

export const orderAddressSchema = z.object({
  street: z.string(),
  aptUnit: z.string().nullable(),
  //   city: z.string(),
  state: z.enum([
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ]),
  zipcode: z.string(),
});
export type OrderAddress = z.infer<typeof orderAddressSchema>;

export const orderContactSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  phone: z.string(),
});
export type OrderContact = z.infer<typeof orderContactSchema>;

export const sockSizeEnumSchema = z.enum(["S", "M", "LG", "XL"]);
export type SockSize = z.infer<typeof sockSizeEnumSchema>;

export const orderItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  size: sockSizeEnumSchema,
  sockVariantId: z.number(),
});
export const orderItemListSchema = z.array(orderItemSchema);
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderStatusEnumSchema = z.enum([
  "pending",
  "received",
  "shipped",
  "delivered",
  "canceled",
  "returned",
]);
export type OrderStatus = z.infer<typeof orderStatusEnumSchema>;

export const orderSchema = z.object({
  orderId: z.number().optional(),
  invoiceNumber: z.string(),
  total: z.number(),
  status: orderStatusEnumSchema,
  address: orderAddressSchema,
  contact: orderContactSchema,
  items: orderItemListSchema,
  createdAt: z.string().optional(),
});
export type Order = z.infer<typeof orderSchema>;

export const ordersPaginatedResponseSchema = z.object({
  items: z.array(orderSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});
export type OrdersPaginatedResponse = z.infer<typeof ordersPaginatedResponseSchema>;