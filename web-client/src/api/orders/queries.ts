import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Order } from "./model";
import { HttpOrderService } from "./service";
import toast from "react-hot-toast";

const orderService = new HttpOrderService();

export function useGetOrderByIdOptions(orderId: number, enabled = true) {
  return {
    queryKey: ["order", { orderId }],
    queryFn: () => orderService.getOrderById(orderId),
    enabled,
    onError: (error: Error) => {
      toast.error(`Failed to fetch order: ${error.message}`);
    },
  };
}

export function useGetOrderById(
  orderId: number,
  enabled = true
): UseQueryResult<Order, Error> {
  return useQuery(useGetOrderByIdOptions(orderId, enabled));
}

