import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { Admin } from "./model";
import { HttpAdminService } from "./service";

const adminService = new HttpAdminService();

export function useGetAdminsOptions(enabled = true) {
  return queryOptions({
    queryKey: ["admins"],
    queryFn: adminService.getAdmins,
    enabled,
  });
}

export function useGetAdmins(
  enabled?: boolean,
): UseQueryResult<Admin[], Error> {
  return useQuery(useGetAdminsOptions(enabled));
}
