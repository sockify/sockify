import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { Order, OrdersPaginatedResponse, OrderStatus } from "./model";
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

export function useGetOrdersOptions(status: OrderStatus, limit: number, offset: number, enabled = true) {
  return queryOptions({
    queryKey: ["orders", { status, limit, offset }],
    queryFn: () => orderService.getOrders(status, limit, offset),
    enabled,
  });
}

export function useGetOrders(
  status: OrderStatus,
  limit: number,
  offset: number,
  enabled = true,
): UseQueryResult<OrdersPaginatedResponse> {
  return useQuery(useGetOrdersOptions(status, limit, offset, enabled));
}