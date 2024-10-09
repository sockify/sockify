import axios from "axios";

import { AdminsPaginatedResponse, adminsPaginatedSchema } from "./model";

export interface AdminService {
  getAdmins(limit: number, offset: number): Promise<AdminsPaginatedResponse>;
}

export class HttpAdminService implements AdminService {
  async getAdmins(
    limit: number,
    offset: number,
  ): Promise<AdminsPaginatedResponse> {
    const { data } = await axios.get("/api/v1/admins", {
      params: {
        limit,
        offset,
      },
    });

    return adminsPaginatedSchema.parse(data);
  }
}
