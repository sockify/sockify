import { z } from "zod";

export const newsletterEntrySchema = z.object({
  email: z.string().email(),
});
export type NewsletterEntry = z.infer<typeof newsletterEntrySchema>;
export const newsletterEntryListSchema = z.array(newsletterEntrySchema);

export const newsletterSubscribeRequestSchema = z.object({
  email: z.string().email(),
});
export type NewsletterSubscribeRequest = z.infer<
  typeof newsletterSubscribeRequestSchema
>;

export const newsletterUnsubscribeRequestSchema = z.object({
  email: z.string().email(),
});
export type NewsletterUnsubscribeRequest = z.infer<
  typeof newsletterUnsubscribeRequestSchema
>;
