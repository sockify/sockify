import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { SimilarSock, Sock, SocksPaginatedResponse } from "./model";
import { HttpInventoryService } from "./service";

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
