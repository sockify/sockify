import axiosInstance from "@/shared/axios";

import {
  Sock,
  SocksPaginatedResponse,
  sockSchema,
  socksPaginatedResponseSchema,
} from "./model";

export interface InventoryService {
  getSockById(sockId: number): Promise<Sock>;
  getSocks(limit: number, offset: number): Promise<SocksPaginatedResponse>;
}

export class HttpInventoryService implements InventoryService {
  async getSockById(sockId: number): Promise<Sock> {
    const { data } = await axiosInstance.get(`/api/v1/socks/${sockId}`);
    return sockSchema.parse(data);
  }

  async getSocks(
    limit: number,
    offset: number,
  ): Promise<SocksPaginatedResponse> {
    const { data } = await axiosInstance.get(`/api/v1/socks`, {
      params: { limit, offset },
    });
    return socksPaginatedResponseSchema.parse(data);
  }
}
