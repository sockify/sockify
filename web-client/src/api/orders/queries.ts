import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { Order } from "./model";
import { HttpOrderService } from "./service";

const orderService = new HttpOrderService();

export function useGetOrderByIdOptions(orderId: number, enabled = true) {
  return queryOptions({
    queryKey: ["orders", { orderId }],
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

export function useGetOrderByInvoiceOptions(invoiceNumber: string) {
  return queryOptions({
    queryKey: ["orders", { invoiceNumber }],
    queryFn: () => orderService.getOrderByInvoice(invoiceNumber),
  });
}
export function useGetOrderByInvoice(
  invoiceNumber: string,
): UseQueryResult<Order> {
  return useQuery(useGetOrderByInvoiceOptions(invoiceNumber));
}
