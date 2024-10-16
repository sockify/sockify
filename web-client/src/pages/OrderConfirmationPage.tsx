import { useGetStripeOrderConfirmation } from "@/api/cart/queries";
import GenericError from "@/components/GenericError";
import { SESSION_ID_QUERY_PARAM } from "@/shared/constants";
import { useSearchParams } from "react-router-dom";

export default function OrderConfirmationPage() {
  const [params] = useSearchParams();

  const sessionId = params.get(SESSION_ID_QUERY_PARAM);

  if (!sessionId) {
    return (
      <div className="mt-10">
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

  return (
    <>
      <p>order confirmation: {sessionId}</p>

      {isLoading ? (
        <>Loading...</>
      ) : isError ? (
        <>Error: {error.message}</>
      ) : (
        <>{JSON.stringify(orderConfirmation)}</>
      )}
    </>
  );
}
