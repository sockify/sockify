import { useGetSocks } from "@/api/inventory/queries";
import GenericError from "@/components/GenericError";
import InventoryTable from "@/components/InventoryTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SOCKS_RESULTS_LIMIT = 8;

export default function AdminInventoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * SOCKS_RESULTS_LIMIT;
  const { data, error, isLoading } = useGetSocks(SOCKS_RESULTS_LIMIT, offset);

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

  const handleRowClick = (sockId: number) => {
    navigate(`/admin/socks/${sockId}`);
  };

  const totalSocks = data.total;
  const totalPages = Math.ceil(totalSocks / SOCKS_RESULTS_LIMIT);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="admin-inventory-page h-full space-y-6 px-4 py-6 md:px-8">
      <section className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-3xl font-bold">Inventory Management</h1>

        <Button
          className="ml-auto"
          onClick={() => console.log("Navigate to Add New Product page")}
        >
          <Plus className="mr-2" />
          Add New Product
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

      <section className="mt-4 flex justify-center pb-8">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <span className="mx-4">
          Page {page} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </Button>
      </section>
    </div>
  );
}
