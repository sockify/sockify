import { CheckoutItem, CheckoutOrderRequest } from "@/api/cart/model";
import { useCheckoutWithStripeMutation } from "@/api/cart/queries";
import {
  OrderAddress,
  OrderContact,
  stateEnumSchema,
} from "@/api/orders/model";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { US_STATES } from "@/shared/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ChevronLeft, CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const checkoutFormSchema = z.object({
  firstname: z
    .string()
    .min(1, "First name is required")
    .max(32, "First name must be 32 characters or less"),
  lastname: z
    .string()
    .min(1, "Last name is required")
    .max(32, "Last name must be 32 characters or less"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(16, "Phone number must be 16 digits or less"),
  street: z
    .string()
    .min(1, "Street address is required")
    .max(100, "Street address must be 100 characters or less"),
  aptUnit: z
    .string()
    .max(16, "Apartment/Unit must be 16 characters or less")
    .optional(),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be must be 100 characters or less"),
  state: stateEnumSchema,
  zipcode: z
    .string()
    .min(5, "Zipcode must be at least 5 digits")
    .max(10, "Zipcode must be 10 digits or less"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, empty } = useCart();
  const checkoutMutation = useCheckoutWithStripeMutation();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      street: "",
      aptUnit: "",
      city: "",
      zipcode: "",
    },
  });

  const handleCheckout = async (data: CheckoutFormValues) => {
    if (items.length < 1) {
      toast.error("Unable to checkout without any items in the cart");
      return;
    }

    const address: OrderAddress = {
      street: data.street,
      aptUnit: data.aptUnit,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
    };
    const contact: OrderContact = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
    };
    const orderItems: CheckoutItem[] = items.map((item) => ({
      sockVariantId: item.sockVariantId,
      quantity: item.quantity,
    }));

    const order: CheckoutOrderRequest = {
      address,
      contact,
      items: orderItems,
    };

    try {
      const result = await checkoutMutation.mutateAsync({ ...order });
      setIsRedirecting(true);
      form.reset();
      empty();
      window.location.replace(result.paymentUrl);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(`Checkout failed: ${error?.response?.data?.message}`);
      } else {
        toast.error("Checkout failed. Try again.");
      }
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6 px-4 py-10 md:px-8">
        <div className="animate-pulse text-primary">
          <DollarSign className="h-48 w-48" />
        </div>
        <p className="text-lg font-semibold text-muted-foreground">
          Redirecting to Stripe...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10 2xl:container md:px-8">
      <div className="flex items-center justify-center gap-6 pb-12">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCheckout)}
            className="w-[48rem] space-y-4"
          >
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => navigate("/cart")}>
                <ChevronLeft className="h-5 w-5 animate-pulse" />
              </Button>
              <h1 className="self-start text-3xl font-extrabold">Checkout</h1>
            </div>

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street address</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aptUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment/unit (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 md:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name="select-state"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>States</SelectLabel>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        type="number"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="pb-3 text-muted-foreground">
              Shipping information and order updates will be sent to your email
              address.
            </p>

            <Button
              type="submit"
              className="w-full"
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                <LoadingSpinner size={16} className="mr-3" />
              ) : (
                <CreditCard className="mr-3 h-5 w-5" />
              )}
              {checkoutMutation.isPending ? "Processing..." : "Pay with Stripe"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
