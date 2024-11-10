import { NewsletterSubscribeRequest } from "@/api/newsletter/model";
import { useNewsletterSubscribeMutation } from "@/api/newsletter/queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PROJECT_GITHUB_URL } from "@/shared/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

const newsletterSubscriptionFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Must be a valid email address" }),
});
type NewsletterSubscriptionForm = z.infer<
  typeof newsletterSubscriptionFormSchema
>;

export default function Footer() {
  const subscribeMutation = useNewsletterSubscribeMutation();

  const form = useForm<NewsletterSubscriptionForm>({
    resolver: zodResolver(newsletterSubscriptionFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubscribe = async (data: NewsletterSubscriptionForm) => {
    const { email } = data;
    const payload: NewsletterSubscribeRequest = {
      email,
    };

    await subscribeMutation.mutateAsync(payload);
    form.reset();
  };

  return (
    <footer className="bg-primary text-gray-200">
      <div className="mx-auto px-4 py-12 2xl:container md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Sockify</h2>
            <p className="text-sm">
              Bringing comfort to your feet, one pair at a time.
            </p>

            <div className="flex space-x-4">
              <a
                href={PROJECT_GITHUB_URL}
                target="_blank"
                className="hover:text-white"
              >
                <Github size={25} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold text-white">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="hover:text-white">
                  Socks
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Stay updated
            </h3>
            <p className="mb-4 text-sm">
              Subscribe to our newsletter for exclusive offers and sock tips.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubscribe)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your email"
                          className="text-gray-800"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </Form>
          </section>
        </div>

        <div className="mt-8 border-t border-gray-300 pt-8 text-center text-sm">
          <p>Sockify &copy; {new Date().getFullYear()}. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
