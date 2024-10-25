// src/api/socks/queries.ts
import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";
import { Sock, SocksPaginatedResponse } from "./model";
import { HttpSockService } from "./service";

const sockService = new HttpSockService();

// Options for fetching a single sock by ID
export function useGetSockByIdOptions(sockId?: number) {
    return queryOptions({
        queryKey: ["socks", { sockId }],
        queryFn: () => sockService.getSockById(sockId!),
        enabled: Boolean(sockId),
    });
}

// Hook for fetching a single sock by ID
export function useGetSockById(sockId?: number): UseQueryResult<Sock> {
    return useQuery(useGetSockByIdOptions(sockId));
}

// Options for fetching paginated socks
export function useGetSocksOptions(limit: number, offset: number, enabled = true) {
    return queryOptions({
        queryKey: ["socks", { limit, offset }],
        queryFn: () => sockService.getSocks(limit, offset),
        enabled,
    });
}

// Hook for fetching paginated socks
export function useGetSocks(limit: number, offset: number, enabled = true): UseQueryResult<SocksPaginatedResponse> {
    return useQuery(useGetSocksOptions(limit, offset, enabled));
}
