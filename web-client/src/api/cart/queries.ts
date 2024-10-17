import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { OrderConfirmation } from "./model";
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
