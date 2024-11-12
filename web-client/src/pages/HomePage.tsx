import { useGetSocks } from "@/api/inventory/queries";
import GenericError from "@/components/GenericError";
import SockCard, { SockCardSkeleton } from "@/components/SockCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SlidersHorizontal, Truck } from "lucide-react";
import { ReactElement, useMemo, useState } from "react";

const SOCKS_RESULTS_LIMIT = 32; // XL screens: 8 rows of 4 items

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetSocks(
    SOCKS_RESULTS_LIMIT,
    (page - 1) * SOCKS_RESULTS_LIMIT,
  );
  const totalPages = Math.ceil((data?.total ?? 0) / SOCKS_RESULTS_LIMIT);

  const renderPaginationButtons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PaginationItem key={`socks-page-${i}`}>
          <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return buttons;
  }, [totalPages, page]);

  return (
    <div className="mx-auto px-4 py-10 md:px-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Our socks</h1>
        {/* TODO: add filters sidebar */}
        <Button variant="outline" disabled>
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
      </header>

      <section className="flex min-h-[calc(100vh-12rem)] flex-col justify-between">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            <SockGridSkeleton />
          ) : isError ? (
            <div className="w-screen">
              <GenericError
                message="Unable to load socks"
                stackTrace={error.stack}
              />
            </div>
          ) : data?.items && data.items.length > 0 ? (
            data.items.map((sock) => <SockCard key={sock.id} sock={sock} />)
          ) : (
            <NoSocks />
          )}
        </div>

        {data?.items && data.items.length > 0 && totalPages >= 1 && (
          <Pagination className="mt-10">
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
      </section>
    </div>
  );
}

function NoSocks() {
  return (
    <div className="flex w-screen flex-col items-center gap-8 p-4 text-center">
      <Truck className="h-64 w-64 text-muted" />
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">No socks found</h3>
        <p className="text-muted-foreground">
          Check back later to find the pair you've been looking for
        </p>
      </div>
    </div>
  );
}

function SockGridSkeleton() {
  const renderGrid = () => {
    const items: ReactElement[] = [];
    for (let i = 0; i < 8; i++) {
      items.push(<SockCardSkeleton />);
    }
    return items;
  };

  return renderGrid();
}
