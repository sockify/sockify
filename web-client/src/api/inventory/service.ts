import axiosInstance from "@/shared/axios";
import { ServerMessage, serverMessageSchema } from "@/shared/types";
import {
  AddEditVariantRequest,
  CreateSockRequest,
  CreateSockResponse,
  SimilarSock,
  Sock,
  SocksPaginatedResponse,
  UpdateSockRequest,
  createSockResponseSchema,
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
  updateSockDetails(
    sockId: number,
    updatedSock: UpdateSockRequest
  ): Promise<ServerMessage>;
  addEditSockVariant(
    sockId: number,
    variant: AddEditVariantRequest
  ): Promise<ServerMessage>;
}

export class HttpInventoryService implements InventoryService {
  async getSockById(sockId: number): Promise<Sock> {
    const { data } = await axiosInstance.get(`/api/v1/socks/${sockId}`);
    return sockSchema.parse(data);
  }

  async getSocks(
    limit: number,
    offset: number
  ): Promise<SocksPaginatedResponse> {
    const { data } = await axiosInstance.get(`/api/v1/socks`, {
      params: { limit, offset },
    });
    return socksPaginatedResponseSchema.parse(data);
  }

  async getSimilarSocks(sockId: number): Promise<SimilarSock[]> {
    const { data } = await axiosInstance.get(
      `/api/v1/socks/${sockId}/similar-socks`
    );
    return similarSockListSchema.parse(data);
  }

  async deleteSock(sockId: number): Promise<ServerMessage> {
    const { data } = await axiosInstance.delete(`/api/v1/socks/${sockId}`);
    return serverMessageSchema.parse(data);
  }

  async createSock(payload: CreateSockRequest): Promise<CreateSockResponse> {
    const { data } = await axiosInstance.post(`/api/v1/socks`, payload);
    return createSockResponseSchema.parse(data);
  }

  async updateSockDetails(
    sockId: number,
    updatedSock: UpdateSockRequest
  ): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(
      `/api/v1/socks/${sockId}`,
      updatedSock
    );
    return serverMessageSchema.parse(data);
  }

  async addEditSockVariant(
    sockId: number,
    variant: AddEditVariantRequest
  ): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(
      `/api/v1/socks/${sockId}/variants`,
      variant
    );
    return serverMessageSchema.parse(data);
  }
}
