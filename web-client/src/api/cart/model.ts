import { z } from "zod";

export const addressSchema = z.object({
  street: z.string(),
  aptUnit: z.string(),
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
export type Address = z.infer<typeof addressSchema>;

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

export const orderConfirmationSchema = z.object({
  invoiceNumber: z.string(),
  total: z.number(),
  status: orderStatusEnumSchema,
  address: addressSchema,
  items: orderItemListSchema,
  createdAt: z.string(),
});
export type OrderConfirmation = z.infer<typeof orderConfirmationSchema>;

export const cartItemSchema = z.object({
  sockVariantId: z.number(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: sockSizeEnumSchema,
  imageUrl: z.string(),
});
export const cartItemListSchema = z.array(cartItemSchema);
export type CartItem = z.infer<typeof cartItemSchema>;
