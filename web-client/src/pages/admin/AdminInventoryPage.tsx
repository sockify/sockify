import { useGetSocks } from "@/api/inventory/queries";
import AddSockModal from "@/components/AddSockModal";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const SOCKS_RESULTS_LIMIT = 16;

export default function AdminInventoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data, isError, error, isLoading } = useGetSocks(
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

  const handleAddSock = () => {
    setModalOpen(false);
  };

  return (
    <div className="admin-inventory-page h-full space-y-6 px-4 py-6 md:px-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row">
        <h1 className="text-3xl font-bold">Inventory dashboard</h1>

        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Add product
        </Button>
      </section>

      <AddSockModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddSock={handleAddSock}
      />

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

      <div className="flex min-h-[34rem] flex-col justify-between space-y-6">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <GenericError
            title="Error fetching socks"
            message={error instanceof Error ? error.message : "Unknown error"}
          />
        ) : (
          <InventoryTable
            socks={data?.items ?? []}
            onRowClick={handleRowClick}
          />
        )}

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
