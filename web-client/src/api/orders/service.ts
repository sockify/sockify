import axiosInstance from "@/shared/axios";
import { ServerMessage, serverMessageSchema } from "@/shared/types";

import {
  CreateOrderUpdateRequest,
  Order,
  OrderAddress,
  OrderContact,
  OrderStatus,
  OrderUpdateResponse,
  OrdersPaginatedResponse,
  UpdateOrderStatusRequest,
  orderSchema,
  orderUpdateResponseSchema,
  ordersPaginatedResponseSchema,
} from "./model";

export interface OrderService {
  getOrderById(orderId: number): Promise<Order>;
  getOrderByInvoice(invoiceNumber: string): Promise<Order>;
  getOrders(
    limit: number,
    offset: number,
    status?: OrderStatus,
  ): Promise<OrdersPaginatedResponse>;
  getOrderUpdates(orderId: number): Promise<OrderUpdateResponse>;
  createOrderUpdate(
    orderId: number,
    payload: CreateOrderUpdateRequest,
  ): Promise<ServerMessage>;
  updateOrderAddress(
    orderId: number,
    payload: OrderAddress,
  ): Promise<ServerMessage>;
  updateOrderContact(
    orderId: number,
    payload: OrderContact,
  ): Promise<ServerMessage>;
  updateOrderStatus(
    orderId: number,
    payload: UpdateOrderStatusRequest,
  ): Promise<ServerMessage>;
}

export class HttpOrderService implements OrderService {
  async getOrderById(orderId: number): Promise<Order> {
    const { data } = await axiosInstance.get(`/api/v1/orders/${orderId}`);
    return orderSchema.parse(data);
  }

  async getOrderByInvoice(invoiceNumber: string): Promise<Order> {
    const { data } = await axiosInstance.get(
      `/api/v1/orders/invoice/${invoiceNumber}`,
    );
    return orderSchema.parse(data);
  }

  async getOrders(
    limit: number,
    offset: number,
    status?: OrderStatus,
  ): Promise<OrdersPaginatedResponse> {
    const { data } = await axiosInstance.get(`/api/v1/orders`, {
      params: { status, limit, offset },
    });
    return ordersPaginatedResponseSchema.parse(data);
  }

  async getOrderUpdates(orderId: number): Promise<OrderUpdateResponse> {
    const { data } = await axiosInstance.get(
      `/api/v1/orders/${orderId}/updates`,
    );
    return orderUpdateResponseSchema.parse(data);
  }

  async createOrderUpdate(
    orderId: number,
    payload: CreateOrderUpdateRequest,
  ): Promise<ServerMessage> {
    const { data } = await axiosInstance.post(
      `/api/v1/orders/${orderId}/updates`,
      payload,
    );
    return serverMessageSchema.parse(data);
  }

  async updateOrderAddress(
    orderId: number,
    payload: OrderAddress,
  ): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(
      `/api/v1/orders/${orderId}/address`,
      payload,
    );
    return serverMessageSchema.parse(data);
  }

  async updateOrderContact(
    orderId: number,
    payload: OrderContact,
  ): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(
      `/api/v1/orders/${orderId}/contact`,
      payload,
    );
    return serverMessageSchema.parse(data);
  }

  async updateOrderStatus(
    orderId: number,
    payload: UpdateOrderStatusRequest,
  ): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(
      `/api/v1/orders/${orderId}/status`,
      payload,
    );
    return serverMessageSchema.parse(data);
  }
}
