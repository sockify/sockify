import { z } from "zod";

import {
  orderAddressSchema,
  orderItemListSchema,
  orderStatusEnumSchema,
} from "../orders/model";
import { sockSizeEnumSchema } from "../socks/model";

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
  sockVariantId: z.number(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: sockSizeEnumSchema,
  imageUrl: z.string(),
});
export const cartItemListSchema = z.array(cartItemSchema);
export type CartItem = z.infer<typeof cartItemSchema>;
