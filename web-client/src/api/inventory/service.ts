import axiosInstance from "@/shared/axios";
import { ServerMessage, serverMessageSchema } from "@/shared/types";
import {
  createSockResponseSchema,
  CreateSockRequest,
  CreateSockResponse,
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
  createSock(payload: CreateSockRequest): Promise<CreateSockResponse>;
}

export class HttpInventoryService implements InventoryService {
  async getSockById(sockId: number): Promise<Sock> {
    const { data } = await axiosInstance.get(`/api/v1/socks/${sockId}`);
    return sockSchema.parse(data); // Validate response with schema
  }

  async getSocks(limit: number, offset: number): Promise<SocksPaginatedResponse> {
    const { data } = await axiosInstance.get(`/api/v1/socks`, {
      params: { limit, offset },
    });
    return socksPaginatedResponseSchema.parse(data); // Validate response with schema
  }

  async getSimilarSocks(sockId: number): Promise<SimilarSock[]> {
    const { data } = await axiosInstance.get(
      `/api/v1/socks/${sockId}/similar-socks`
    );
    return similarSockListSchema.parse(data); // Validate response with schema
  }

  async deleteSock(sockId: number): Promise<ServerMessage> {
    const { data } = await axiosInstance.delete(`/api/v1/socks/${sockId}`);
    return serverMessageSchema.parse(data); // Validate response with schema
  }

  async createSock(payload: CreateSockRequest): Promise<CreateSockResponse> {
    const { data } = await axiosInstance.post(`/api/v1/socks`, payload);
    return createSockResponseSchema.parse(data); // Validate response with schema
  }
}