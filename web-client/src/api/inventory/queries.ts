import { ServerMessage } from "@/shared/types";
import {
  UseMutationResult,
  UseQueryResult,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import {
  AddEditVariant,
  CreateSockRequest,
  CreateSockResponse,
  SimilarSock,
  Sock,
  SocksPaginatedResponse,
  UpdateSock,
  createSockRequestSchema,
} from "./model";
import { HttpInventoryService } from "./service";

const sockService = new HttpInventoryService();

export function useGetSockByIdOptions(sockId?: number) {
  return queryOptions({
    queryKey: ["socks", { sockId }],
    queryFn: () => sockService.getSockById(sockId!),
    enabled: Boolean(sockId),
  });
}
export function useGetSockById(sockId?: number): UseQueryResult<Sock> {
  return useQuery(useGetSockByIdOptions(sockId));
}

export function useGetSocksOptions(
  limit: number,
  offset: number,
  enabled = true,
) {
  return queryOptions({
    queryKey: ["socks", { limit, offset }],
    queryFn: () => sockService.getSocks(limit, offset),
    enabled,
  });
}

export function useGetSocks(
  limit: number,
  offset: number,
  enabled = true,
): UseQueryResult<SocksPaginatedResponse> {
  return useQuery(useGetSocksOptions(limit, offset, enabled));
}

export function useGetSimilarSocksOptions(sockId: number) {
  return queryOptions({
    queryKey: ["similar-socks", { sockId }],
    queryFn: () => sockService.getSimilarSocks(sockId),
  });
}

export function useGetSimilarSocks(
  sockId: number,
): UseQueryResult<SimilarSock[]> {
  return useQuery(useGetSimilarSocksOptions(sockId));
}

export function useDeleteSockMutation(): UseMutationResult<
  ServerMessage,
  Error,
  number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sockId: number) => sockService.deleteSock(sockId),
    onSuccess: () => {
      toast.success("Sock successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["socks"] });
    },
    onError: () => {
      toast.error("Unable to delete sock");
    },
  });
}

export function useCreateSockMutation(): UseMutationResult<
  CreateSockResponse,
  AxiosError,
  CreateSockRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => {
      createSockRequestSchema.parse(payload);
      return sockService.createSock(payload);
    },
    onSuccess: () => {
      toast.success("Sock successfully added");
      queryClient.invalidateQueries({ queryKey: ["socks"] });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "An unexpected error occurred.";
      toast.error(`Unable to add sock: ${errorMessage}`);
      console.error(
        "Error creating sock:",
        error.response?.data || error.message,
      );
    },
  });
}

export function useUpdateSockMutation(): UseMutationResult<
  ServerMessage,
  Error,
  UpdateSock & { id: number }
> {
  return useMutation({
    mutationFn: (updatedSock: UpdateSock & { id: number }) =>
      sockService.updateSockDetails(updatedSock),
    onSuccess: () => {
      toast.success("Sock details updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update sock details.");
    },
  });
}

export function useAddEditVariantMutation(): UseMutationResult<
  ServerMessage,
  Error,
  { sockId: number; variant: AddEditVariant }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sockId, variant }) => {
      const sock = await sockService.getSockById(sockId);
      const updatedSock = {
        sock: {
          name: sock.name,
          description: sock.description,
          previewImageUrl: sock.previewImageUrl,
        },
        variants: [
          ...sock.variants.filter((v) => v.id !== variant.sockId),
          variant,
        ],
      };
      return sockService.updateSockDetails({ id: sockId, ...updatedSock });
    },
    onSuccess: () => {
      toast.success("Variant added/edited successfully!");
      queryClient.invalidateQueries({ queryKey: ["socks"] });
    },
    onError: (error) => {
      console.error("Error adding/editing variant:", error);
      toast.error("Failed to add/edit variant.");
    },
  });
}
