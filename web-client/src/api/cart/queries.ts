import {
  UseMutationResult,
  UseQueryResult,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  CheckoutOrderRequest,
  OrderConfirmation,
  StripeCheckoutResponse,
} from "./model";
import { HttpCartService } from "./service";

const cartService = new HttpCartService();

export function useGetStripeOrderConfirmationOptions(sessionId: string | null) {
  return queryOptions({
    queryKey: ["order-confirmation", { sessionId }],
    queryFn: () => cartService.getStripeOrderConfirmation(sessionId!),
    enabled: Boolean(sessionId),
  });
}
export function useGetStripeOrderConfirmation(
  sessionId: string | null,
): UseQueryResult<OrderConfirmation> {
  return useQuery(useGetStripeOrderConfirmationOptions(sessionId));
}

export function useCheckoutWithStripeMutation(): UseMutationResult<
  StripeCheckoutResponse,
  Error,
  CheckoutOrderRequest
> {
  return useMutation({
    mutationFn: (params) => cartService.createStripeCheckoutSession(params),
  });
}
