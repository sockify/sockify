import { useGetStripeOrderConfirmation } from "@/api/cart/queries";
import { SESSION_ID_QUERY_PARAM } from "@/shared/constants";
import { useSearchParams } from "react-router-dom";

export default function OrderConfirmationPage() {
  const [params] = useSearchParams();

  const sessionId = params.get(SESSION_ID_QUERY_PARAM);

  if (!sessionId) {
    return <>No session ID found!</>;
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
