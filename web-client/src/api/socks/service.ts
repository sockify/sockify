// src/api/socks/service.ts
import axiosInstance from "@/shared/axios";
import {
    Sock,
    sockSchema,
    SocksPaginatedResponse,
    socksPaginatedResponseSchema,
} from "./model";

// Define the SockService interface
export interface SockService {
    getSockById(sockId: number): Promise<Sock>;
    getSocks(limit: number, offset: number): Promise<SocksPaginatedResponse>;
    createSock(sock: Partial<Sock>): Promise<Sock>;
    updateSock(sockId: number, sock: Partial<Sock>): Promise<Sock>;
    deleteSock(sockId: number): Promise<void>;
}

// Implement the SockService using HTTP requests
export class HttpSockService implements SockService {

    // Get a sock by ID
    async getSockById(sockId: number): Promise<Sock> {
        const { data } = await axiosInstance.get(`/api/v1/socks/${sockId}`);
        return sockSchema.parse(data); // Validate response using Zod
    }

    // Get paginated socks
    async getSocks(limit: number, offset: number): Promise<SocksPaginatedResponse> {
        const { data } = await axiosInstance.get(`/api/v1/socks`, {
            params: { limit, offset },
        });
        return socksPaginatedResponseSchema.parse(data); // Validate response using Zod
    }

    // Create a new sock
    async createSock(sock: Partial<Sock>): Promise<Sock> {
        const { data } = await axiosInstance.post(`/api/v1/socks`, sock);
        return sockSchema.parse(data); // Validate response using Zod
    }

    // Update an existing sock
    async updateSock(sockId: number, sock: Partial<Sock>): Promise<Sock> {
        const { data } = await axiosInstance.put(`/api/v1/socks/${sockId}`, sock);
        return sockSchema.parse(data); // Validate response using Zod
    }

    // Delete a sock by ID
    async deleteSock(sockId: number): Promise<void> {
        await axiosInstance.delete(`/api/v1/socks/${sockId}`);
    }
}
