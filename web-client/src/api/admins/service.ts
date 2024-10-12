import axiosInstance from "@/shared/axios";
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from "@/shared/constants";
import { decodeJwtToken } from "@/shared/utils/jwt";

import {
  Admin,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminsPaginatedResponse,
  AuthResponse,
  adminLoginResponseSchema,
  adminSchema,
  adminsPaginatedSchema,
} from "./model";

export interface AdminService {
  getAdmins(limit: number, offset: number): Promise<AdminsPaginatedResponse>;
  getAdminById(adminId: number): Promise<Admin>;
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

  async getAdminById(adminId: number): Promise<Admin> {
    const { data } = await axiosInstance.get(`/api/v1/admins/${adminId}`);
    return adminSchema.parse(data);
  }

  async login(payload: AdminLoginRequest): Promise<AuthResponse> {
    const { data } = await axiosInstance.post("/api/v1/admins/login", payload);
    const { token } = adminLoginResponseSchema.parse(data);
    // For `getAdminById` to work, `token` must be in local storage ahead of time.
    localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, token);

    const decodedToken = decodeJwtToken(token);
    if (!decodedToken) {
      throw new Error(`Unable to decode auth token.`);
    }
    const admin = await this.getAdminById(decodedToken.userId);

    return { token, admin };
  }
}
