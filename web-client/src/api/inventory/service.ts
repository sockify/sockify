import axiosInstance from "@/shared/axios";

import {
  SimilarSock,
  Sock,
  SocksPaginatedResponse,
  similarSockListSchema,
  sockSchema,
  socksPaginatedResponseSchema,
} from "./model";

export interface InventoryService {
  getSockById(sockId: number): Promise<Sock>;
  getSocks(limit: number, offset: number): Promise<SocksPaginatedResponse>;
  getSimilarSocks(sockId: number): Promise<SimilarSock[]>;
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

  async getSimilarSocks(sockId: number): Promise<SimilarSock[]> {
    const { data } = await axiosInstance.get(
      `/api/v1/socks/${sockId}/similar-socks`,
    );
    return similarSockListSchema.parse(data);
  }

  // Refactored deleteSock method using axios
  async deleteSock(sockId: number): Promise<ServerMessage> {
    try {
      const { data } = await axiosInstance.delete(`/api/v1/socks/${sockId}`);
      return data; // Assuming ServerMessage is the response data structure
    } catch (error: any) {
      // Handle error, you can also inspect the error response here
      console.error("Failed to delete sock:", error.response || error);
      throw new Error("Failed to delete sock");
    }
  }
}
