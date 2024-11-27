import axiosInstance from "@/shared/axios";
import { ServerMessage, serverMessageSchema } from "@/shared/types";

import {
  NewsletterEntry,
  NewsletterSubscribeRequest,
  NewsletterUnsubscribeRequest,
  newsletterEntryListSchema,
} from "./model";

interface NewsletterService {
  subscribe(payload: NewsletterSubscribeRequest): Promise<ServerMessage>;
  unsubscribe(payload: NewsletterUnsubscribeRequest): Promise<ServerMessage>;
  getEmails(): Promise<NewsletterEntry[]>;
}

export class HttpNewsletterService implements NewsletterService {
  async subscribe(payload: NewsletterSubscribeRequest): Promise<ServerMessage> {
    const { data } = await axiosInstance.post(
      "/api/v1/newsletter/subscribe",
      payload,
    );
    return serverMessageSchema.parse(data);
  }

  async unsubscribe(
    payload: NewsletterUnsubscribeRequest,
  ): Promise<ServerMessage> {
    const { data } = await axiosInstance.post(
      "/api/v1/newsletter/unsubscribe",
      payload,
    );
    return serverMessageSchema.parse(data);
  }

  async getEmails(): Promise<NewsletterEntry[]> {
    const { data } = await axiosInstance.get("/api/v1/newsletter/emails");
    return newsletterEntryListSchema.parse(data);
  }
}
