import { useGetStripeOrderConfirmation } from "@/api/cart/queries";
import GenericError from "@/components/GenericError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SESSION_ID_QUERY_PARAM } from "@/shared/constants";
import { toShippingAddress } from "@/shared/utils/strings";
import dayjs from "dayjs";
import { Check } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function OrderConfirmationPage() {
  const [params] = useSearchParams();

  const sessionId = params.get(SESSION_ID_QUERY_PARAM);
  if (!sessionId) {
    return (
      <div className="py-10">
        <GenericError
          message={`Unable to retrieve the '${SESSION_ID_QUERY_PARAM}' query parameter.`}
        />
      </div>
    );
  }

  const {
    data: orderConfirmation,
    isLoading,
    isError,
    error,
  } = useGetStripeOrderConfirmation(sessionId);

  if (isLoading) {
    return (
      <div className="py-10">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10">
        <GenericError stackTrace={error.stack} />
      </div>
    );
  }

  return (
    <section className="bg-background px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Order confirmed!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Order details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <section className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Invoice #:</p>
                <p className="font-medium">
                  {orderConfirmation!.invoiceNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Order date:</p>
                <p className="font-medium">
                  {dayjs(orderConfirmation!.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
            </section>
            <Separator />

            <section>
              <h3 className="mb-2 font-semibold">Items ordered:</h3>
              {orderConfirmation!.items.map((item) => (
                <div
                  key={item.sockVariantId}
                  className="mb-2 flex justify-between"
                >
                  <span>
                    {item.quantity}x {item.name} ({item.size})
                  </span>
                  <span>${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </section>
            <Separator />

            <section className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${orderConfirmation!.total.toFixed(2)}</span>
            </section>

            <section>
              <h3 className="mb-2 font-semibold">Shipping address:</h3>
              <p>{toShippingAddress(orderConfirmation!.address)}</p>
            </section>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="mb-4">
            We've sent a confirmation email to your registered email address.
          </p>
          <Button asChild>
            <Link to="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>

        <CardContent className="space-y-4">
          <section className="grid grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-1/2" />
            </div>

            <div>
              <Skeleton className="h-6 w-1/2" />
            </div>
          </section>
          <Separator />

          <section>
            <h3 className="mb-2">
              <Skeleton className="h-8 w-1/3" />
            </h3>
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </section>
          <Separator />

          <section className="flex justify-between">
            <Skeleton className="h-6 w-1/3" />
          </section>

          <section>
            <h3 className="mb-2">
              <Skeleton className="h-8 w-1/3" />
            </h3>
            <Skeleton className="h-6 w-3/4" />
          </section>
        </CardContent>
      </Card>

      <div>
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="mt-4 h-10 w-1/4" />
      </div>
    </div>
  );
};
