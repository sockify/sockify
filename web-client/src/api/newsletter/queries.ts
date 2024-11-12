import { ServerMessage } from "@/shared/types";
import {
  UseMutationResult,
  UseQueryResult,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  NewsletterEntry,
  NewsletterSubscribeRequest,
  NewsletterUnsubscribeRequest,
} from "./model";
import { HttpNewsletterService } from "./service";

const newsletterService = new HttpNewsletterService();

export function useNewsletterSubscribeMutation(): UseMutationResult<
  ServerMessage,
  Error,
  NewsletterSubscribeRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => newsletterService.subscribe(payload),
    onSuccess: (_, { email }) => {
      toast.success(`Subscribed "${email}" to our newsletter`);

      queryClient.invalidateQueries({
        queryKey: ["newsletter-emails"],
      });
    },
    onError: (_, { email }) => {
      toast.error(`Failed to subscribe "${email}"`);
    },
  });
}

export function useNewsletterUnsubscribeMutation(): UseMutationResult<
  ServerMessage,
  Error,
  NewsletterUnsubscribeRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => newsletterService.unsubscribe(payload),
    onSuccess: (_, { email }) => {
      toast.success(`Unsubscribed "${email}" from our newsletter`);

      queryClient.invalidateQueries({
        queryKey: ["newsletter-emails"],
      });
    },
    onError: (_, { email }) => {
      toast.error(`Failed to unsubscribe "${email}"`);
    },
  });
}

export function useGetNewsletterEmailsOptions() {
  return queryOptions({
    queryKey: ["newsletter-emails"],
    queryFn: () => newsletterService.getEmails(),
  });
}
export function useGetNewsletterEmails(): UseQueryResult<NewsletterEntry[]> {
  return useQuery(useGetNewsletterEmailsOptions());
}
