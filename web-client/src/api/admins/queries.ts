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
  AdminsPaginatedResponse,
  AuthResponse,
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

export function useGetAdminByIdOptions(adminId: number, enabled = true) {
  return queryOptions({
    queryKey: ["admins", { adminId }],
    queryFn: () => adminService.getAdminById(adminId),
    enabled,
  });
}
export function useGetAdminById(adminId: number, enabled?: boolean) {
  return useQuery(useGetAdminByIdOptions(adminId, enabled));
}

export function useLoginAdminMutation(): UseMutationResult<
  AuthResponse,
  Error,
  AdminLoginRequest
> {
  return useMutation({
    mutationFn: (params) => adminService.login(params),
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.admin.firstname}!`);
    },
    onError: (err) => {
      toast.error(`Failed to login: ${err.message}`);
    },
  });
}
