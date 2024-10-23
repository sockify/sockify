import {
  CreateOrderUpdateDTO,
  CreateOrderUpdateRequest,
  OrderAddress,
  OrderContact,
  UpdateOrderAddressDTO,
  UpdateOrderContactDTO,
  stateEnumSchema,
} from "@/api/orders/model";
import {
  useCreateOrderUpdateMutation,
  useGetOrderByIdOptions,
  useGetOrderUpdatesOptions,
  useUpdateOrderAddressMutation,
  useUpdateOrderContactMutation,
} from "@/api/orders/queries";
import GenericError from "@/components/GenericError";
import LoadingSpinner from "@/components/LoadingSpinner";
import TableEmpty from "@/components/TableEmpty";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { US_STATES } from "@/shared/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const createOrderUpdateFormSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});
type CreateOrderUpdateForm = z.infer<typeof createOrderUpdateFormSchema>;

const updateOrderAddressFormSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  aptUnit: z.string().optional(),
  // TODO: add city
  state: stateEnumSchema,
  zipcode: z
    .string()
    .min(1, { message: "Zipcode is required" })
    .max(10, { message: "Zipcode must be at most 10 characters long" }),
});
type UpdateOrderAddressForm = z.infer<typeof updateOrderAddressFormSchema>;

const updateOrderContactFormSchema = z.object({
  firstname: z.string().min(1, { message: "Firstname is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
});
type UpdateOrderContactForm = z.infer<typeof updateOrderContactFormSchema>;

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const orderIdNumber = parseInt(orderId!);

  // Modal/popup state controllers
  const [createOrderUpdateOpen, setCreateOrderUpdateOpen] = useState(false);
  const [updateOrderAddressOpen, setUpdateOrderAddressOpen] = useState(false);
  const [updateOrderContactOpen, setUpdateOrderContactOpen] = useState(false);

  // Queries
  const queries = useQueries({
    queries: [
      useGetOrderByIdOptions(orderIdNumber),
      useGetOrderUpdatesOptions(orderIdNumber),
    ],
  });
  const order = queries[0].data;
  const updates = queries[1].data;

  const isError = queries.some((query) => query.isError);
  const isLoading = queries.some((query) => query.isLoading);

  // Mutations
  const createOrderUpdateMutation = useCreateOrderUpdateMutation();
  const updateOrderAddressMutation = useUpdateOrderAddressMutation();
  const updateOrderContactMutation = useUpdateOrderContactMutation();

  // Forms
  const createOrderUpdateForm = useForm<CreateOrderUpdateForm>({
    resolver: zodResolver(createOrderUpdateFormSchema),
  });
  const updateOrderAddressForm = useForm<UpdateOrderAddressForm>({
    resolver: zodResolver(updateOrderAddressFormSchema),
  });
  const updateOrderContactForm = useForm<UpdateOrderContactForm>({
    resolver: zodResolver(updateOrderContactFormSchema),
  });

  const handleCreateOrderUpdate = async (data: CreateOrderUpdateForm) => {
    const payload: CreateOrderUpdateRequest = {
      message: data.message.trim(),
    };
    const params: CreateOrderUpdateDTO = { orderId: orderIdNumber, payload };

    await createOrderUpdateMutation.mutateAsync(params);
    setCreateOrderUpdateOpen(false);
    createOrderUpdateForm.reset();
  };

  const handleUpdateOrderAddress = async (data: UpdateOrderAddressForm) => {
    const address: OrderAddress = {
      street: data.street.trim(),
      aptUnit: data.aptUnit?.trim(),
      state: data.state,
      zipcode: data.zipcode.trim(),
    };
    const params: UpdateOrderAddressDTO = { orderId: orderIdNumber, address };

    await updateOrderAddressMutation.mutateAsync(params);
    setUpdateOrderAddressOpen(false);
    updateOrderAddressForm.reset();
  };

  const handleUpdateOrderContact = async (data: UpdateOrderContactForm) => {
    const contact: OrderContact = {
      firstname: data.firstname.trim(),
      lastname: data.lastname.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
    };
    const params: UpdateOrderContactDTO = { orderId: orderIdNumber, contact };

    await updateOrderContactMutation.mutateAsync(params);
    setUpdateOrderContactOpen(false);
    updateOrderContactForm.reset();
  };

  useEffect(() => {
    if (order) {
      updateOrderAddressForm.reset({
        street: order.address.street,
        aptUnit: order.address.aptUnit ?? "",
        state: order.address.state,
        zipcode: order.address.zipcode,
      });
    }
  }, [order, updateOrderAddressForm]);

  useEffect(() => {
    if (order) {
      updateOrderContactForm.reset({
        firstname: order.contact.firstname,
        lastname: order.contact.lastname,
        phone: order.contact.phone,
        email: order.contact.email,
      });
    }
  }, [order, updateOrderContactForm]);

  if (isError) {
    return (
      <div className="px-4 py-6 md:px-8">
        <GenericError
          message={`Unable to fetch the order details with order ID: ${orderId}`}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 md:px-8">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <section className="h-full space-y-6 px-4 py-6 md:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <h1 className="text-2xl lg:text-3xl">
          <span className="font-bold">Invoice #:</span>{" "}
          <code className="rounded bg-muted p-1">{order!.invoiceNumber}</code>
        </h1>

        <p>Dropdown</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="w-full">
          <CardHeader className="text-2xl font-bold">
            Order information
          </CardHeader>
          <CardContent>
            <p>
              <strong>Date:</strong>{" "}
              {dayjs(order!.createdAt).format("YYYY-MM-DD")}
            </p>
            <p>
              <strong>Status:</strong> {order!.status}
            </p>
            {/* TODO: add subtotal, tax, shipping */}
            <p>
              <strong>Subtotal:</strong> ${order!.total.toFixed(2)}
            </p>
            <p>
              <strong>Tax:</strong> $0.00
            </p>
            <p>
              <strong>Shipping:</strong> $0.00
            </p>
            <p>
              <strong>Total:</strong> ${order!.total.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="text-2xl font-bold">
            Contact information
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {order!.contact.firstname}{" "}
              {order!.contact.lastname}
            </p>
            <p>
              <strong>Phone:</strong> {order!.contact.phone}
            </p>
            <p>
              <strong>Email:</strong> {order!.contact.email}
            </p>

            <Dialog
              open={updateOrderContactOpen}
              onOpenChange={setUpdateOrderContactOpen}
            >
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setUpdateOrderContactOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit contact
              </Button>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Update contact</DialogTitle>
                </DialogHeader>

                <Form {...updateOrderContactForm}>
                  <form
                    onSubmit={updateOrderContactForm.handleSubmit(
                      handleUpdateOrderContact,
                    )}
                    className="space-y-6"
                  >
                    <div className="grid gap-4">
                      <div className="flex gap-6">
                        <FormField
                          control={updateOrderContactForm.control}
                          name="firstname"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Firstname</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={updateOrderContactForm.control}
                          name="lastname"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Lastname</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-6">
                        <FormField
                          control={updateOrderContactForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  type="phone"
                                  placeholder="333-323-9320"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={updateOrderContactForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="jdoe@google.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={updateOrderContactMutation.isPending}
                        >
                          {updateOrderContactMutation.isPending && (
                            <LoadingSpinner size={16} className="mr-2" />
                          )}
                          {updateOrderContactMutation.isPending
                            ? "Updating..."
                            : "Update"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="text-2xl font-bold">Shipping address</CardHeader>
        <CardContent>
          <p>{order!.address.street}</p>
          <p>Apt/unit: {order!.address.aptUnit}</p>
          {/* TODO: add city */}
          <p>
            {order!.address.state}, {order!.address.zipcode}
          </p>

          <Dialog
            open={updateOrderAddressOpen}
            onOpenChange={setUpdateOrderAddressOpen}
          >
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setUpdateOrderAddressOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit address
            </Button>

            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Update address</DialogTitle>
              </DialogHeader>

              <Form {...updateOrderAddressForm}>
                <form
                  onSubmit={updateOrderAddressForm.handleSubmit(
                    handleUpdateOrderAddress,
                  )}
                  className="space-y-6"
                >
                  <div className="grid gap-4">
                    <FormField
                      control={updateOrderAddressForm.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="123 E Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateOrderAddressForm.control}
                      name="aptUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apt/unit</FormLabel>
                          <FormControl>
                            <Input placeholder="C4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-6">
                      <FormField
                        control={updateOrderAddressForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>State</FormLabel>
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
                                    <SelectItem
                                      key={state.value}
                                      value={state.value}
                                    >
                                      {state.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateOrderAddressForm.control}
                        name="zipcode"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Zipcode</FormLabel>
                            <FormControl>
                              <Input placeholder="33094" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={updateOrderAddressMutation.isPending}
                      >
                        {updateOrderAddressMutation.isPending && (
                          <LoadingSpinner size={16} className="mr-2" />
                        )}
                        {updateOrderAddressMutation.isPending
                          ? "Updating..."
                          : "Update"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="text-2xl font-bold">Order items</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order!.items.map((item) => (
                <TableRow key={item.sockVariantId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    ${(item.quantity * item.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {/* TODO: fix subtotal, shipping, tax etc. */}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell>${order!.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Tax
                </TableCell>
                <TableCell>$0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Shipping
                </TableCell>
                <TableCell>$0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="font-bold">
                  ${order!.total.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="text-2xl font-bold">Order updates</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Timestamp</TableHead>
                <TableHead className="w-[300px]">Created by</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updates!.length > 0 ? (
                updates!.map((update) => (
                  <TableRow key={update.id}>
                    <TableCell>{update.createdAt}</TableCell>
                    <TableCell>
                      {update.createdBy.firstname} {update.createdBy.lastname} (
                      {update.createdBy.username})
                    </TableCell>
                    <TableCell>{update.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={99}>
                    <TableEmpty message="No updates found." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Dialog
            open={createOrderUpdateOpen}
            onOpenChange={setCreateOrderUpdateOpen}
          >
            <Button
              className="mt-4"
              onClick={() => setCreateOrderUpdateOpen(true)}
            >
              Add update
            </Button>

            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create order update</DialogTitle>
              </DialogHeader>

              <Form {...createOrderUpdateForm}>
                <form
                  onSubmit={createOrderUpdateForm.handleSubmit(
                    handleCreateOrderUpdate,
                  )}
                  className="space-y-6"
                >
                  <div className="grid gap-4">
                    <FormField
                      control={createOrderUpdateForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your message"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={createOrderUpdateMutation.isPending}
                      >
                        {createOrderUpdateMutation.isPending && (
                          <LoadingSpinner size={16} className="mr-2" />
                        )}
                        {createOrderUpdateMutation.isPending
                          ? "Creating..."
                          : "Create"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-4/5" />
      <Skeleton className="h-12 w-3/5" />
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-12 w-4/5" />
    </div>
  );
}
