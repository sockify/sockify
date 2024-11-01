import { z } from "zod";

import { sockSizeEnumSchema } from "../inventory/model";

export const stateEnumSchema = z.enum([
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
]);
export type StateEnum = z.infer<typeof stateEnumSchema>;

export const orderAddressSchema = z.object({
  street: z.string(),
  aptUnit: z.string().optional().nullable(),
  //   city: z.string(),
  state: stateEnumSchema,
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
export type OrdersPaginatedResponse = z.infer<
  typeof ordersPaginatedResponseSchema
>;

export const orderUpdateCreatorSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
});
export type OrderUpdateCreator = z.infer<typeof orderUpdateCreatorSchema>;

export const orderUpdateSchema = z.object({
  id: z.number(),
  message: z.string(),
  createdAt: z.string(),
  createdBy: orderUpdateCreatorSchema,
});
export type OrderUpdate = z.infer<typeof orderUpdateSchema>;

export const orderUpdateResponseSchema = z.array(orderUpdateSchema);
export type OrderUpdateResponse = z.infer<typeof orderUpdateResponseSchema>;

export const createOrderUpdateRequestSchema = z.object({
  message: z.string(),
});
export type CreateOrderUpdateRequest = z.infer<
  typeof createOrderUpdateRequestSchema
>;

export const updateOrderStatusRequestSchema = z.object({
  message: z.string(),
  newStatus: orderStatusEnumSchema,
});
export type UpdateOrderStatusRequest = z.infer<
  typeof updateOrderStatusRequestSchema
>;

export interface CreateOrderUpdateDTO {
  orderId: number;
  payload: CreateOrderUpdateRequest;
}
export interface UpdateOrderAddressDTO {
  orderId: number;
  address: OrderAddress;
}
export interface UpdateOrderContactDTO {
  orderId: number;
  contact: OrderContact;
}
export interface UpdateOrderStatusDTO {
  orderId: number;
  payload: UpdateOrderStatusRequest;
}
