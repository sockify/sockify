import { ServerMessage } from "@/shared/types";
import {
  UseMutationResult,
  UseQueryResult,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  CreateOrderUpdateDTO,
  Order,
  OrderStatus,
  OrderUpdateResponse,
  OrdersPaginatedResponse,
  UpdateOrderAddressDTO,
  UpdateOrderContactDTO,
  UpdateOrderStatusDTO,
} from "./model";
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
    queryKey: ["order-updates", { orderId }],
    queryFn: () => orderService.getOrderUpdates(orderId),
    enabled,
  });
}

export function useGetOrderUpdates(
  orderId: number,
  enabled = true,
): UseQueryResult<OrderUpdateResponse> {
  return useQuery(useGetOrderUpdatesOptions(orderId, enabled));
}

export function useCreateOrderUpdateMutation(): UseMutationResult<
  ServerMessage,
  Error,
  CreateOrderUpdateDTO
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }) =>
      orderService.createOrderUpdate(orderId, payload),
    onSuccess: (_, { orderId }) => {
      toast.success("Order update created");

      queryClient.invalidateQueries({
        queryKey: ["order-updates", { orderId }],
      });
    },
    onError: () => {
      toast.error("Unable to create order update");
    },
  });
}

export function useUpdateOrderAddressMutation(): UseMutationResult<
  ServerMessage,
  Error,
  UpdateOrderAddressDTO
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, address }) =>
      orderService.updateOrderAddress(orderId, address),
    onSuccess: (_, { orderId }) => {
      toast.success("Order address updated");

      queryClient.invalidateQueries({
        queryKey: ["orders", { orderId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-updates", { orderId }],
      });
    },
    onError: () => {
      toast.error("Unable to update order address");
    },
  });
}

export function useUpdateOrderContactMutation(): UseMutationResult<
  ServerMessage,
  Error,
  UpdateOrderContactDTO
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, contact }) =>
      orderService.updateOrderContact(orderId, contact),
    onSuccess: (_, { orderId }) => {
      toast.success("Order contact updated");

      queryClient.invalidateQueries({
        queryKey: ["orders", { orderId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-updates", { orderId }],
      });
    },
    onError: () => {
      toast.error("Unable to update order contact");
    },
  });
}

export function useUpdateOrderStatusMutation(): UseMutationResult<
  ServerMessage,
  Error,
  UpdateOrderStatusDTO
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }) =>
      orderService.updateOrderStatus(orderId, payload),
    onSuccess: (_, { orderId }) => {
      toast.success("Order status updated");

      queryClient.invalidateQueries({
        queryKey: ["orders", { orderId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-updates", { orderId }],
      });
    },
    onError: () => {
      toast.error("Unable to update order status");
    },
  });
}
