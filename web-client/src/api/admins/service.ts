import axiosInstance from "@/shared/axios";

import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminsPaginatedResponse,
  adminLoginResponseSchema,
  adminsPaginatedSchema,
} from "./model";

export interface AdminService {
  getAdmins(limit: number, offset: number): Promise<AdminsPaginatedResponse>;
  login(payload: AdminLoginRequest): Promise<AdminLoginResponse>;
}

export class HttpAdminService implements AdminService {
  async getAdmins(
    limit: number,
    offset: number,
  ): Promise<AdminsPaginatedResponse> {
    const { data } = await axiosInstance.get("/api/v1/admins", {
      params: {
        limit,
        offset,
      },
    });
    return adminsPaginatedSchema.parse(data);
  }

  async login(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
    const { data } = await axiosInstance.post("/api/v1/admins/login", payload);
    return adminLoginResponseSchema.parse(data);
  }
}
