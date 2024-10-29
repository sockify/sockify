import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const checkoutSchema = z.object({
    firstname: z.string().min(1, "First name is required").max(32, "First name must be 32 characters or less"),
    lastname: z.string().min(1, "Last name is required").max(32, "Last name must be 32 characters or less"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(16, "Phone number must be 16 digits or less").optional(),
    street: z.string().min(1, "Street address is required").max(100, "Street address must be 100 characters or less"),
    apt_unit: z.string().max(16, "Apartment/Unit must be 16 characters or less").optional(),
    state: z.string().min(2, "State is required").max(2, "State must be a valid abbreviation"),
    zipcode: z.string().min(5, "Zipcode must be at least 5 digits").max(10, "Zipcode must be 10 digits or less"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            street: "",
            apt_unit: "",
            state: "",
            zipcode: "",
        },
    });

    const onSubmit = (data: CheckoutFormValues) => {
        console.log("Form data:", data);
        // Add your Stripe integration logic for payment here
    };

    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL",
        "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
        "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
        "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    return (
        <div className="mx-auto px-4 py-12 2xl:container md:px-8">
            <h1 className="text-3xl font-extrabold mb-6">Checkout</h1>
            <div className="flex justify-center items-center min-h-screen">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[48rem]">
                        {/* Container for First Name and Last Name */}
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
                            name="apt_unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Apartment/Unit (optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Container for State and Zipcode */}
                        <div className="flex space-x-4">
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel className="font-bold">State</FormLabel>
                                        <FormControl>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full">
                                                        {field.value || "Select a state"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full max-h-60 overflow-auto">
                                                    {states.map((state) => (
                                                        <DropdownMenuItem
                                                            key={state}
                                                            onSelect={() => field.onChange(state)}
                                                        >
                                                            {state}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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

                        <p className="text-gray-500 mt-6 mb-6">
                            Shipping information and order updates will be sent to your email address.
                        </p>

                        <Button type="submit" className="w-full">Pay with Stripe</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
