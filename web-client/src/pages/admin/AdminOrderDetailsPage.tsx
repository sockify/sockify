import {
  CreateOrderUpdateDTO,
  CreateOrderUpdateRequest,
} from "@/api/orders/model";
import {
  useCreateOrderUpdateMutation,
  useGetOrderByIdOptions,
  useGetOrderUpdatesOptions,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const createOrderUpdateFormSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});
type CreateOrderUpdateForm = z.infer<typeof createOrderUpdateFormSchema>;

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const orderIdNumber = parseInt(orderId!);

  // Forms
  const createOrderUpdateForm = useForm<CreateOrderUpdateForm>({
    resolver: zodResolver(createOrderUpdateFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // Modal/popup state controllers
  const [createOrderUpdateOpen, setCreateOrderUpdateOpen] = useState(false);

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

  const handleAddUpdate = async (data: CreateOrderUpdateForm) => {
    const payload: CreateOrderUpdateRequest = {
      message: data.message,
    };
    const params: CreateOrderUpdateDTO = { orderId: orderIdNumber, payload };

    await createOrderUpdateMutation.mutateAsync(params);

    setCreateOrderUpdateOpen(false);
    createOrderUpdateForm.reset();
  };

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
        <h1 className="text-3xl">
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
                  onSubmit={createOrderUpdateForm.handleSubmit(handleAddUpdate)}
                  className="space-y-6"
                >
                  <div className="grid gap-2">
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
