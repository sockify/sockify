import {
  OrderStatus,
  OrdersPaginatedResponse,
  orderStatusEnumSchema,
} from "@/api/orders/model";
import {
  useGetOrderByIdOptions,
  useGetOrderByInvoiceOptions,
  useGetOrdersOptions,
} from "@/api/orders/queries";
import GenericError from "@/components/GenericError";
import OrdersTable from "@/components/OrdersTable";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const ORDERS_RESULTS_LIMIT = 25;

type FilterType = "status" | "orderId" | "invoice";
type StatusFilter = OrderStatus | "any";

const DEFAULT_FILTER: FilterType = "status";
const DEFAULT_STATUS: StatusFilter = "any";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<FilterType>(DEFAULT_FILTER);
  const [filterText, setFilterText] = useState<string>("");
  const [status, setStatus] = useState<StatusFilter>(DEFAULT_STATUS);
  const [page, setPage] = useState(1);

  const queries = useQueries({
    queries: [
      useGetOrdersOptions(
        ORDERS_RESULTS_LIMIT,
        (page - 1) * ORDERS_RESULTS_LIMIT,
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

  const orders: OrdersPaginatedResponse | undefined = queries[0].data;
  const totalPages = Math.ceil((orders?.total ?? 0) / ORDERS_RESULTS_LIMIT);

  const order = queries
    .slice(1)
    .map((query) => query.data)
    .filter(Boolean);
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  const renderPaginationButtons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return buttons;
  }, [totalPages, page]);

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

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <GenericError
          message="Unable to load orders."
          stackTrace={queries.map((query) => query.error?.stack).join(",")}
        />
      ) : filterText ? (
        <OrdersTable data={[...order] as any} isFiltered={true} />
      ) : (
        <OrdersTable data={orders?.items ?? []} isFiltered={false} />
      )}

      {filter === "status" && totalPages >= 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {renderPaginationButtons}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

function TableSkeleton() {
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
