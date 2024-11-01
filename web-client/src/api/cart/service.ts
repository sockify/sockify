import axiosInstance from "@/shared/axios";

import {
  CheckoutOrderRequest,
  OrderConfirmation,
  StripeCheckoutResponse,
  orderConfirmationSchema,
  stripeCheckoutResponseSchema,
} from "./model";

export interface CartService {
  getStripeOrderConfirmation(sessionId: string): Promise<OrderConfirmation>;
  createStripeCheckoutSession(
    payload: CheckoutOrderRequest,
  ): Promise<StripeCheckoutResponse>;
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

  async createStripeCheckoutSession(
    payload: CheckoutOrderRequest,
  ): Promise<StripeCheckoutResponse> {
    const { data } = await axiosInstance.post(
      `/api/v1/cart/checkout/stripe-session`,
      payload,
    );
    return stripeCheckoutResponseSchema.parse(data);
  }
}
