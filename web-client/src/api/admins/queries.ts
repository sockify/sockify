import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { AdminsPaginatedResponse } from "./model";
import { HttpAdminService } from "./service";

const adminService = new HttpAdminService();

export function useGetAdminsOptions(limit = 50, offset = 0, enabled = true) {
  return queryOptions({
    queryKey: ["admins", { limit, offset }],
    queryFn: () => adminService.getAdmins(limit, offset),
    enabled,
  });
}

export function useGetAdmins(
  limit?: number,
  offset?: number,
  enabled?: boolean,
): UseQueryResult<AdminsPaginatedResponse, Error> {
  return useQuery(useGetAdminsOptions(limit, offset, enabled));
}
