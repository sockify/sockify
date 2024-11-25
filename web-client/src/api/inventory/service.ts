import axiosInstance from "@/shared/axios";
import { ServerMessage, serverMessageSchema } from "@/shared/types";
import {
  SimilarSock,
  Sock,
  SocksPaginatedResponse,
  similarSockListSchema,
  sockSchema,
  socksPaginatedResponseSchema,
  UpdateSock, 
  AddEditVariant,
} from "./model";

export interface InventoryService {
  getSockById(sockId: number): Promise<Sock>;
  getSocks(limit: number, offset: number): Promise<SocksPaginatedResponse>;
  getSimilarSocks(sockId: number): Promise<SimilarSock[]>;
  deleteSock(sockId: number): Promise<ServerMessage>;
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

  async deleteSock(sockId: number): Promise<ServerMessage> {
    const { data } = await axiosInstance.delete(`/api/v1/socks/${sockId}`);
    return serverMessageSchema.parse(data);
  }

  async updateSockDetails(updatedSock: UpdateSock & { id: number }): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(`/api/v1/socks/${updatedSock.id}`, {
      sock: updatedSock.sock, 
      variants: updatedSock.variants, 
    });
    return serverMessageSchema.parse(data);
  }
  
  async addEditSockVariant(sockId: number, variant: AddEditVariant): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(`/api/v1/socks/${sockId}/variants`, {
      size: variant.size,
      price: variant.price,
      quantity: variant.quantity,
    });
    return serverMessageSchema.parse(data);
  }
  
  async updateSockWithVariant(sockId: number, updatedSock: UpdateSock): Promise<ServerMessage> {
    const { data } = await axiosInstance.patch(`/api/v1/socks/${sockId}`, updatedSock);
    return serverMessageSchema.parse(data);
  }  

}
