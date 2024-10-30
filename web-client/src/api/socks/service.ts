import axiosInstance from "@/shared/axios";

import { Sock, sockSchema } from "./model";

export interface SockService {
  getSockById(sockId: number): Promise<Sock>;
}

export class HttpSockService implements SockService {
  async getSockById(sockId: number): Promise<Sock> {
    const { data } = await axiosInstance.get(`/api/v1/socks/${sockId}`);
    return sockSchema.parse(data);
  }
}
