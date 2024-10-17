import axiosInstance from "@/shared/axios";

import { OrderConfirmation, orderConfirmationSchema } from "./model";

export interface CartService {
  getStripeOrderConfirmation(sessionId: string): Promise<OrderConfirmation>;
}

export class HttpCartService implements CartService {
  async getStripeOrderConfirmation(
    sessionId: string,
  ): Promise<OrderConfirmation> {
    const { data } = await axiosInstance.get(
      `/api/v1/cart/checkout/stripe-confirmation/${sessionId}`,
    );
    return orderConfirmationSchema.parse(data);
  }
}
