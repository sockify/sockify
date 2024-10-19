import axiosInstance from "@/shared/axios";

import { Order, orderSchema, OrdersPaginatedResponse, OrderStatus, ordersPaginatedResponseSchema } from "./model";

export interface OrderService {
  getOrderById(orderId: number): Promise<Order>;
  getOrderByInvoice(invoiceNumber: string): Promise<Order>;
  getOrders(status: OrderStatus, limit: number, offset: number): Promise<OrdersPaginatedResponse>;
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

  async getOrders(status: OrderStatus, limit: number, offset: number): Promise<OrdersPaginatedResponse> {
    const { data } = await axiosInstance.get(`/api/v1/orders`, {
      params: { status, limit, offset },
    });
    return ordersPaginatedResponseSchema.parse(data);
  }
}
