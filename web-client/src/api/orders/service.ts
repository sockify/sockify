import axiosInstance from "@/shared/axios";
import { orderSchema, Order } from "./model";

export class HttpOrderService {
  async getOrderById(orderId: number): Promise<Order> {
    const { data } = await axiosInstance.get(`/api/v1/orders/${orderId}`);
    return orderSchema.parse(data);
  }
}

