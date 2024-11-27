import {
  CreateOrderUpdateDTO,
  CreateOrderUpdateRequest,
  OrderAddress,
  OrderContact,
  OrderStatus,
  UpdateOrderAddressDTO,
  UpdateOrderContactDTO,
  UpdateOrderStatusRequest,
  stateEnumSchema,
} from "@/api/orders/model";
import {
  useCreateOrderUpdateMutation,
  useGetOrderByIdOptions,
  useGetOrderUpdatesOptions,
  useUpdateOrderAddressMutation,
  useUpdateOrderContactMutation,
  useUpdateOrderStatusMutation,
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

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Received", value: "received" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Returned", value: "returned" },
  { label: "Canceled", value: "canceled" },
];

const createUpdateFormSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});
type CreateUpdateForm = z.infer<typeof createUpdateFormSchema>;

const updateAddressFormSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  aptUnit: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: stateEnumSchema,
  zipcode: z
    .string()
    .min(1, { message: "Zipcode is required" })
    .max(10, { message: "Zipcode must be at most 10 characters long" }),
});
type UpdateAddressForm = z.infer<typeof updateAddressFormSchema>;

const updateContactFormSchema = z.object({
  firstname: z.string().min(1, { message: "Firstname is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
});
type UpdateContactForm = z.infer<typeof updateContactFormSchema>;

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const orderIdNumber = parseInt(orderId!);

  const [currentStatus, setCurrentStatus] = useState<OrderStatus | undefined>(
    undefined,
  );

  // Modal/popup state controllers
  const [isCreateUpdateOpen, setIsCreateUpdateOpen] = useState(false);
  const [isUpdateAddressOpen, setIsUpdateAddressOpen] = useState(false);
  const [isUpdateContactOpen, setIsUpdateContactOpen] = useState(false);

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
  const createUpdateMutation = useCreateOrderUpdateMutation();
  const updateAddressMutation = useUpdateOrderAddressMutation();
  const updateContactMutation = useUpdateOrderContactMutation();
  const updateStatusMutation = useUpdateOrderStatusMutation();

  // Forms
  const createUpdateForm = useForm<CreateUpdateForm>({
    resolver: zodResolver(createUpdateFormSchema),
  });
  const updateAddressForm = useForm<UpdateAddressForm>({
    resolver: zodResolver(updateAddressFormSchema),
  });
  const updateContactForm = useForm<UpdateContactForm>({
    resolver: zodResolver(updateContactFormSchema),
  });

  const handleCreateUpdate = async (data: CreateUpdateForm) => {
    const payload: CreateOrderUpdateRequest = {
      message: data.message.trim(),
    };
    const params: CreateOrderUpdateDTO = { orderId: orderIdNumber, payload };

    await createUpdateMutation.mutateAsync(params);
    setIsCreateUpdateOpen(false);
    createUpdateForm.reset();
  };

  const handleUpdateAddress = async (data: UpdateAddressForm) => {
    const address: OrderAddress = {
      street: data.street.trim(),
      aptUnit: data.aptUnit?.trim(),
      city: data.city.trim(),
      state: data.state,
      zipcode: data.zipcode.trim(),
    };
    const params: UpdateOrderAddressDTO = { orderId: orderIdNumber, address };

    await updateAddressMutation.mutateAsync(params);
    setIsUpdateAddressOpen(false);
    updateAddressForm.reset();
  };

  const handleUpdateContact = async (data: UpdateContactForm) => {
    const contact: OrderContact = {
      firstname: data.firstname.trim(),
      lastname: data.lastname.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
    };
    const params: UpdateOrderContactDTO = { orderId: orderIdNumber, contact };

    await updateContactMutation.mutateAsync(params);
    setIsUpdateContactOpen(false);
    updateContactForm.reset();
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (currentStatus && canChangeStatus(currentStatus, newStatus)) {
      const payload: UpdateOrderStatusRequest = {
        message: getStatusChangeMessage(newStatus),
        newStatus,
      };

      await updateStatusMutation.mutateAsync({
        orderId: orderIdNumber,
        payload,
      });
      setCurrentStatus(newStatus);
    }
  };

  useEffect(() => {
    if (order) {
      updateAddressForm.reset({
        street: order.address.street,
        aptUnit: order.address.aptUnit ?? "",
        city: order.address.city,
        state: order.address.state,
        zipcode: order.address.zipcode,
      });
    }
  }, [order, updateAddressForm]);

  useEffect(() => {
    if (order) {
      updateContactForm.reset({
        firstname: order.contact.firstname,
        lastname: order.contact.lastname,
        phone: order.contact.phone,
        email: order.contact.email,
      });
    }
  }, [order, updateContactForm]);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order]);

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
      <div className="flex flex-col justify-between gap-6 lg:flex-row">
        <h1 className="text-2xl lg:text-3xl">
          <span className="font-bold">Invoice #:</span>{" "}
          <code className="rounded bg-muted p-1">{order!.invoiceNumber}</code>
        </h1>

        <Select value={currentStatus} onValueChange={handleStatusChange}>
          <SelectTrigger
            className="w-full lg:w-[200px]"
            disabled={updateStatusMutation.isPending}
          >
            <SelectValue placeholder="" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>New status</SelectLabel>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={
                    currentStatus &&
                    !canChangeStatus(currentStatus, option.value)
                  }
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              open={isUpdateContactOpen}
              onOpenChange={setIsUpdateContactOpen}
            >
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setIsUpdateContactOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit contact
              </Button>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Update contact</DialogTitle>
                </DialogHeader>

                <Form {...updateContactForm}>
                  <form
                    onSubmit={updateContactForm.handleSubmit(
                      handleUpdateContact,
                    )}
                    className="space-y-6"
                  >
                    <div className="grid gap-4">
                      <div className="flex gap-6">
                        <FormField
                          control={updateContactForm.control}
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
                          control={updateContactForm.control}
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
                          control={updateContactForm.control}
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
                          control={updateContactForm.control}
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
                          disabled={updateContactMutation.isPending}
                        >
                          {updateContactMutation.isPending && (
                            <LoadingSpinner size={16} className="mr-2" />
                          )}
                          {updateContactMutation.isPending
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
          <CardHeader className="text-2xl font-bold">
            Shipping address
          </CardHeader>
          <CardContent>
            <p>{order!.address.street}</p>
            <p>
              Apt/unit:{" "}
              {order!.address?.aptUnit ? order!.address.aptUnit : "None"}
            </p>
            <p>
              {order!.address.city}, {order!.address.state},{" "}
              {order!.address.zipcode}
            </p>

            <Dialog
              open={isUpdateAddressOpen}
              onOpenChange={setIsUpdateAddressOpen}
            >
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setIsUpdateAddressOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit address
              </Button>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Update address</DialogTitle>
                </DialogHeader>

                <Form {...updateAddressForm}>
                  <form
                    onSubmit={updateAddressForm.handleSubmit(
                      handleUpdateAddress,
                    )}
                    className="space-y-6"
                  >
                    <div className="grid gap-4">
                      <FormField
                        control={updateAddressForm.control}
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
                        control={updateAddressForm.control}
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

                      <div className="flex flex-col gap-6 md:flex-row">
                        <FormField
                          control={updateAddressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Newport" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={updateAddressForm.control}
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
                          control={updateAddressForm.control}
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
                          disabled={updateAddressMutation.isPending}
                        >
                          {updateAddressMutation.isPending && (
                            <LoadingSpinner size={16} className="mr-2" />
                          )}
                          {updateAddressMutation.isPending
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
                  <TableCell>
                    {item.name} ({item.size})
                  </TableCell>
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
                <TableHead className="min-w-[600px]">Message</TableHead>
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
            open={isCreateUpdateOpen}
            onOpenChange={setIsCreateUpdateOpen}
          >
            <Button
              className="mt-4"
              onClick={() => setIsCreateUpdateOpen(true)}
            >
              Add update
            </Button>

            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create order update</DialogTitle>
              </DialogHeader>

              <Form {...createUpdateForm}>
                <form
                  onSubmit={createUpdateForm.handleSubmit(handleCreateUpdate)}
                  className="space-y-6"
                >
                  <div className="grid gap-4">
                    <FormField
                      control={createUpdateForm.control}
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
                        disabled={createUpdateMutation.isPending}
                      >
                        {createUpdateMutation.isPending && (
                          <LoadingSpinner size={16} className="mr-2" />
                        )}
                        {createUpdateMutation.isPending
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

function canChangeStatus(currentStatus: string, newStatus: string) {
  // pending -> received -> shipped -> delivered -> returned
  // |          |
  // |-----------> canceled
  return (
    (newStatus === "received" && currentStatus === "pending") ||
    (newStatus === "canceled" && currentStatus === "pending") ||
    (newStatus === "canceled" && currentStatus === "received") ||
    (newStatus === "shipped" && currentStatus === "received") ||
    (newStatus === "delivered" && currentStatus === "shipped") ||
    (newStatus === "returned" && currentStatus === "delivered")
  );
}

function getStatusChangeMessage(newStatus: OrderStatus): string {
  switch (newStatus) {
    case "pending":
      return "The order is pending payment and awaiting further updates.";
    case "received":
      return "The order has been received and is being processed.";
    case "shipped":
      return "The order has been shipped and is on its way.";
    case "delivered":
      return "The order has been delivered to the customer.";
    case "returned":
      return "The order has been returned.";
    case "canceled":
      return "The order has been canceled.";
    default:
      return "Unknown status.";
  }
}
