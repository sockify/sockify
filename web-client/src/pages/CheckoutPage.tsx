import { CheckoutItem, CheckoutOrderRequest } from "@/api/cart/model";
import { useCheckoutWithStripeMutation } from "@/api/cart/queries";
import {
  OrderAddress,
  OrderContact,
  stateEnumSchema,
} from "@/api/orders/model";
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
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const checkoutSchema = z.object({
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
  state: stateEnumSchema,
  zipcode: z
    .string()
    .min(5, "Zipcode must be at least 5 digits")
    .max(10, "Zipcode must be 10 digits or less"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, empty } = useCart();
  const checkoutMutation = useCheckoutWithStripeMutation();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      street: "",
      aptUnit: "",
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
      form.reset();
      empty();
      window.location.replace(result.paymentUrl);
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto px-4 py-10 2xl:container md:px-8">
      <div className="flex items-center justify-center gap-6 pb-12">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCheckout)}
            className="w-[48rem] space-y-4"
          >
            <h1 className="self-start text-3xl font-extrabold">Checkout</h1>

            <div className="flex space-x-4 font-semibold">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="font-bold">First Name</FormLabel>
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
                    <FormLabel className="font-bold">Last Name</FormLabel>
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
                  <FormLabel className="font-bold">Email</FormLabel>
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
                  <FormLabel className="font-bold">Phone</FormLabel>
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
                  <FormLabel className="font-bold">Street Address</FormLabel>
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
                  <FormLabel className="font-bold">
                    Apartment/unit (optional)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="font-bold">State</FormLabel>
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
                  <FormItem className="w-1/2">
                    <FormLabel className="font-bold">Zipcode</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="pb-3 text-gray-500">
              Shipping information and order updates will be sent to your email
              address.
            </p>

            <Button type="submit" className="w-full">
              Pay with Stripe
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
