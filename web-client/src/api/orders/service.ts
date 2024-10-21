import axiosInstance from "@/shared/axios";

import {
  Order,
  OrderStatus,
  OrdersPaginatedResponse,
  orderSchema,
  ordersPaginatedResponseSchema,
  OrderUpdateResponse,
  orderUpdateResponseSchema
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
    const { data } = await axiosInstance.get(`/api/v1/orders/${orderId}/updates`);
    return orderUpdateResponseSchema.parse(data);
  }  
}
