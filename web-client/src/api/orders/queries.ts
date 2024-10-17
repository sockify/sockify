import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { Order } from "./model";
import { HttpOrderService } from "./service";

const orderService = new HttpOrderService();

export function useGetOrderByIdOptions(orderId: number, enabled = true) {
  return queryOptions({
    queryKey: ["order", { orderId }],
    queryFn: () => orderService.getOrderById(orderId),
    enabled,
  });
}
export function useGetOrderById(
  orderId: number,
  enabled = true,
): UseQueryResult<Order> {
  return useQuery(useGetOrderByIdOptions(orderId, enabled));
}
