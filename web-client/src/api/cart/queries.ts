import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { OrderConfirmation } from "./model";
import { HttpCartService } from "./service";

const cartService = new HttpCartService();

export function useGetStripeOrderConfirmationOptions(sessionId: string) {
  return queryOptions({
    queryKey: ["order-confirmation", { sessionId }],
    queryFn: () => cartService.getStripeOrderConfirmation(sessionId),
  });
}
export function useGetStripeOrderConfirmation(
  sessionId: string,
): UseQueryResult<OrderConfirmation> {
  return useQuery(useGetStripeOrderConfirmationOptions(sessionId));
}
