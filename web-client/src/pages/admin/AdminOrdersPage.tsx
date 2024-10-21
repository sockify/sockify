import { OrderStatus, orderStatusEnumSchema } from "@/api/orders/model";
import {
  useGetOrderByIdOptions,
  useGetOrderByInvoiceOptions,
  useGetOrdersOptions,
} from "@/api/orders/queries";
import GenericError from "@/components/GenericError";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";

const ORDERS_LIMIT = 50;

type FilterType = "status" | "orderId" | "invoice";
type StatusFilter = OrderStatus | "any";

const DEFAULT_FILTER: FilterType = "status";
const DEFAULT_STATUS: StatusFilter = "received";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<FilterType>(DEFAULT_FILTER);
  const [filterText, setFilterText] = useState<string>("");
  const [status, setStatus] = useState<StatusFilter>(DEFAULT_STATUS);
  const [page, setPage] = useState(1);

  const queries = useQueries({
    queries: [
      useGetOrdersOptions(
        ORDERS_LIMIT,
        (page - 1) * ORDERS_LIMIT,
        status === "any" ? undefined : status,
      ),
      useGetOrderByIdOptions(
        filterText && filter === "orderId" ? parseInt(filterText) : undefined,
      ),
      useGetOrderByInvoiceOptions(
        filterText && filter === "invoice" ? filterText : undefined,
      ),
    ],
  });

  const orders = queries[0].data ?? [];
  const order = queries.slice(1).flatMap((query) => query.data ?? []);
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  return (
    <div className="h-full space-y-6 px-4 py-6 md:px-8">
      <h1 className="text-3xl font-bold">Order history</h1>
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="flex w-full flex-col space-y-4 md:w-full md:flex-row md:space-x-4 md:space-y-0">
          <Select
            onValueChange={(value: FilterType) => {
              // Reset the filters
              setFilter(value);
              setFilterText("");
              setStatus(DEFAULT_STATUS);
            }}
          >
            <SelectTrigger className="w-full md:w-1/6">
              <SelectValue
                placeholder={
                  DEFAULT_FILTER[0].toUpperCase() + DEFAULT_FILTER.slice(1)
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="invoice">Invoice #</SelectItem>
              <SelectItem value="orderId">Order ID</SelectItem>
            </SelectContent>
          </Select>

          {filter === "status" ? (
            <Select
              onValueChange={(value: StatusFilter) => setStatus(value)}
              disabled={Boolean(filterText)}
            >
              <SelectTrigger className="w-full md:w-1/3">
                <SelectValue
                  placeholder={
                    DEFAULT_STATUS[0].toUpperCase() + DEFAULT_STATUS.slice(1)
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {orderStatusEnumSchema.options.map((status) => (
                  <SelectItem value={status} key={status}>
                    {status[0].toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={filter === "orderId" ? "number" : "text"}
              placeholder={`Enter ${filter === "orderId" ? "Order ID..." : "Invoice #..."}`}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full md:w-1/3"
              min={1}
            />
          )}
        </div>
      </div>

      <p>{isLoading && "Loading..."}</p>
      {isError && (
        <GenericError
          message="Unable to load orders."
          stackTrace={queries.map((query) => query.error?.stack).join(",")}
        />
      )}
      {filterText ? JSON.stringify(order) : JSON.stringify(orders)}
    </div>
  );
}
