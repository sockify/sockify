import { useGetSocks } from "@/api/socks/queries";
import GenericError from "@/components/GenericError";
import SockCard from "@/components/SockCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Truck } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetSocks(9, (page - 1) * 9);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

  return (
    <div className="mx-auto px-4 py-10 md:px-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Our socks</h1>
        {/* TODO: add filters sidebar */}
        <Button variant="outline" disabled>
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          //  TODO: add loading skeleton
          <p>Loading socks...</p>
        ) : isError ? (
          <GenericError
            message="Unable to load socks"
            stackTrace={error.stack}
          />
        ) : data?.items && data.items.length > 0 ? (
          data.items.map((sock) => <SockCard key={sock.id} sock={sock} />)
        ) : (
          <NoSocks />
        )}
      </div>

      {/* TODO: replace with shadcn pagination */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          disabled={page === 1}
          onClick={handlePrevPage}
        >
          Previous
        </button>

        <span className="font-semibold">{page}</span>

        <button
          className="rounded bg-gray-200 px-4 py-2"
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
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
