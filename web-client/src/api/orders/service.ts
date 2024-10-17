import axiosInstance from "@/shared/axios";

import { Order, orderSchema } from "./model";

export interface OrderService {
  getOrderById(orderId: number): Promise<Order>;
}

export class HttpOrderService implements OrderService {
  async getOrderById(orderId: number): Promise<Order> {
    const { data } = await axiosInstance.get(`/api/v1/orders/${orderId}`);
    return orderSchema.parse(data);
  }
}
