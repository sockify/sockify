import { z } from "zod";

import { sockSizeEnumSchema } from "../inventory/model";
import {
  orderAddressSchema,
  orderContactSchema,
  orderItemListSchema,
  orderStatusEnumSchema,
} from "../orders/model";

export const orderConfirmationSchema = z.object({
  invoiceNumber: z.string(),
  total: z.number(),
  status: orderStatusEnumSchema,
  address: orderAddressSchema,
  items: orderItemListSchema,
  createdAt: z.string(),
});
export type OrderConfirmation = z.infer<typeof orderConfirmationSchema>;

export const cartItemSchema = z.object({
  sockId: z.number(),
  sockVariantId: z.number(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: sockSizeEnumSchema,
  imageUrl: z.string(),
});
export const cartItemListSchema = z.array(cartItemSchema);
export type CartItem = z.infer<typeof cartItemSchema>;

export const checkoutItemSchema = z.object({
  sockVariantId: z.number(),
  quantity: z.number(),
});
export type CheckoutItem = z.infer<typeof checkoutItemSchema>;

export const checkoutOrderRequestSchema = z.object({
  address: orderAddressSchema,
  contact: orderContactSchema,
  items: z.array(checkoutItemSchema),
});
export type CheckoutOrderRequest = z.infer<typeof checkoutOrderRequestSchema>;

export const stripeCheckoutResponseSchema = z.object({
  paymentUrl: z.string().url(),
});
export type StripeCheckoutResponse = z.infer<
  typeof stripeCheckoutResponseSchema
>;
