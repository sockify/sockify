import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { Sock } from "./model";
import { HttpSockService } from "./service";

const sockService = new HttpSockService();

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
