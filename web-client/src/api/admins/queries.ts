import {
  UseQueryResult,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { UseMutationResult } from "node_modules/@tanstack/react-query/build/legacy";
import toast from "react-hot-toast";

import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminsPaginatedResponse,
} from "./model";
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

export function useAdminLoginMutation(): UseMutationResult<
  AdminLoginResponse,
  Error,
  AdminLoginRequest
> {
  return useMutation({
    mutationFn: (params) => adminService.login(params),
    onSuccess: () => {
      toast.success("Welcome back!");
    },
    onError: (err) => {
      toast.error(`Failed to login: ${err.message}`);
    },
  });
}
