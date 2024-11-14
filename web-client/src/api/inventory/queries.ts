import { UseQueryResult, queryOptions, useQuery, UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ServerMessage } from "@/shared/types";
import { HttpInventoryService } from "./service";

import { SimilarSock, Sock, SocksPaginatedResponse } from "./model";

const sockService = new HttpInventoryService();

export function useGetSockByIdOptions(sockId?: number) {
  return queryOptions({
    queryKey: ["socks", { sockId }],
    queryFn: () => sockService.getSockById(sockId!),
    enabled: Boolean(sockId),
  });
}
export function useGetSockById(sockId?: number): UseQueryResult<Sock> {
  return useQuery(useGetSockByIdOptions(sockId));
}

export function useGetSocksOptions(
  limit: number,
  offset: number,
  enabled = true,
) {
  return queryOptions({
    queryKey: ["socks", { limit, offset }],
    queryFn: () => sockService.getSocks(limit, offset),
    enabled,
  });
}
export function useGetSocks(
  limit: number,
  offset: number,
  enabled = true,
): UseQueryResult<SocksPaginatedResponse> {
  return useQuery(useGetSocksOptions(limit, offset, enabled));
}

export function useGetSimilarSocksOptions(sockId: number) {
  return queryOptions({
    queryKey: ["similar-socks", { sockId }],
    queryFn: () => sockService.getSimilarSocks(sockId),
  });
}
export function useGetSimilarSocks(
  sockId: number,
): UseQueryResult<SimilarSock[]> {
  return useQuery(useGetSimilarSocksOptions(sockId));
}

export function useDeleteSockMutation(): UseMutationResult<
  ServerMessage,
  Error,
  number
> {
  const queryClient = useQueryClient();
  //console.log("useDeleteSockMutation loaded:", useDeleteSockMutation);

  return useMutation({
    mutationFn: (sockId: number) => sockService.deleteSock(sockId),
    onSuccess: (_, sockId) => {
      toast.success("Sock successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["socks"],
      });
    },
    onError: () => {
      toast.error("Unable to delete sock");
    },
  });
}
