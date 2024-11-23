import axiosInstance from "@/shared/axios";
import { ServerMessage, serverMessageSchema } from "@/shared/types";
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
  deleteSock(sockId: number): Promise<ServerMessage>;
  createSock(payload: {
    sock: { name: string; description: string; previewImageUrl: string };
    variants: { size: string; price: number; quantity: number }[];
  }): Promise<Sock>;
}

export class HttpInventoryService implements InventoryService {
  async getSockById(sockId: number): Promise<Sock> {
    const { data } = await axiosInstance.get(`/api/v1/socks/${sockId}`);
    return sockSchema.parse(data);
  }

  async getSocks(limit: number, offset: number): Promise<SocksPaginatedResponse> {
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

  async deleteSock(sockId: number): Promise<ServerMessage> {
    const { data } = await axiosInstance.delete(`/api/v1/socks/${sockId}`);
    return serverMessageSchema.parse(data);
  }

  async createSock(payload: {
    sock: { name: string; description: string; previewImageUrl: string };
    variants: { size: string; price: number; quantity: number }[];
  }): Promise<Sock> {
    const { data } = await axiosInstance.post(`/api/v1/socks`, payload);
    return sockSchema.parse(data);
  }
}
