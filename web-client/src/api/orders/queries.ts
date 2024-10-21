import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";


import { Order, OrderStatus, OrdersPaginatedResponse, OrderUpdateResponse } from "./model";
import { HttpOrderService } from "./service";

const orderService = new HttpOrderService();

export function useGetOrderByIdOptions(orderId?: number) {
  return queryOptions({
    queryKey: ["orders", { orderId }],
    queryFn: () => orderService.getOrderById(orderId!),
    enabled: Boolean(orderId),
  });
}
export function useGetOrderById(orderId?: number): UseQueryResult<Order> {
  return useQuery(useGetOrderByIdOptions(orderId));
}

export function useGetOrderByInvoiceOptions(invoiceNumber?: string) {
  return queryOptions({
    queryKey: ["orders", { invoiceNumber }],
    queryFn: () => orderService.getOrderByInvoice(invoiceNumber!),
    enabled: Boolean(invoiceNumber),
  });
}
export function useGetOrderByInvoice(
  invoiceNumber?: string,
): UseQueryResult<Order> {
  return useQuery(useGetOrderByInvoiceOptions(invoiceNumber));
}

export function useGetOrdersOptions(
  limit: number,
  offset: number,
  status?: OrderStatus,
  enabled = true,
) {
  return queryOptions({
    queryKey: ["orders", { status, limit, offset }],
    queryFn: () => orderService.getOrders(limit, offset, status),
    enabled,
  });
}
export function useGetOrders(
  limit: number,
  offset: number,
  status?: OrderStatus,
  enabled = true,
): UseQueryResult<OrdersPaginatedResponse> {
  return useQuery(useGetOrdersOptions(limit, offset, status, enabled));
}

export function useGetOrderUpdatesOptions(orderId: number, enabled = true) {
  return queryOptions({
    queryKey: ["orderUpdates", { orderId }],
    queryFn: () => orderService.getOrderUpdates(orderId),
    enabled,
  });
}

export function useGetOrderUpdates(
  orderId: number,
  enabled = true
): UseQueryResult<OrderUpdateResponse> {
  return useQuery(useGetOrderUpdatesOptions(orderId, enabled));
}

