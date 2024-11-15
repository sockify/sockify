import { useGetSocks } from "@/api/inventory/queries";
import GenericError from "@/components/GenericError";
import InventoryTable from "@/components/InventoryTable";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const SOCKS_RESULTS_LIMIT = 16;

export default function AdminInventoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetSocks(
    SOCKS_RESULTS_LIMIT,
    (page - 1) * SOCKS_RESULTS_LIMIT,
  );
  const totalPages = Math.ceil((data?.total ?? 0) / SOCKS_RESULTS_LIMIT);

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

  const handleRowClick = (sockId: number) => {
    navigate(`/admin/socks/${sockId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <GenericError
        title="Error fetching socks"
        message={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return <div>No socks available in the inventory.</div>;
  }

  return (
    <div className="admin-inventory-page h-full space-y-6 px-4 py-6 md:px-8">
      <section className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-3xl font-bold">Inventory management</h1>

        <Button
          className="ml-auto"
          onClick={() => console.log("Navigate to Add New Product page")}
        >
          <Plus className="mr-2" />
          Add product
        </Button>
      </section>

      <section className="relative flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="relative md:w-1/2">
          <Input
            disabled
            type="text"
            placeholder="Search by product name or ID"
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
            <Search className="text-gray-500" size={20} />
          </div>
        </div>

        <Select onValueChange={(value) => console.log(`Filter by ${value}`)}>
          <SelectTrigger disabled className="md:w-64">
            Filter by category
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
            <SelectItem value="Formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="w-full">
        <InventoryTable socks={data.items} onRowClick={handleRowClick} />
      </section>

      {totalPages >= 1 && (
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
