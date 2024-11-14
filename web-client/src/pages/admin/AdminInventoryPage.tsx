import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import InventoryTable from '@/components/InventoryTable';
import { useNavigate } from 'react-router-dom';
import { useGetSocks } from '@/api/inventory/queries';
import { useState } from 'react';

export default function AdminInventoryPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 8;
  const offset = (page - 1) * limit;

  const { data, error, isLoading } = useGetSocks(limit, offset);
  //console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching socks: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  if (!data || !data.items || data.items.length === 0) {
    return <div>No socks available in the inventory.</div>;
  }

  const handleRowClick = (sockId: string) => {
    navigate(`/socks/${sockId}`);
  };

  const totalSocks = data.total;
  const totalPages = Math.ceil(totalSocks / limit);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="admin-inventory-page">
      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-extrabold">Inventory Management</h1>

        <Button
          className="ml-auto"
          onClick={() => console.log('Navigate to Add New Product page')}
        >
          Add New Product
        </Button>
      </div>

      <div className="search-filter flex items-center mt-4">

        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" size={20} />
          </div>

          <input
            type="text"
            placeholder="Search by product name or ID"
            className="search-bar pl-10 w-full py-2 px-4 border border-gray-300 rounded-md"
          />
        </div>

        <div className="ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled className="category-filter">
                Filter by category
                <ChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('Filter by Sports')}>Sports</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Filter by Casual')}>Casual</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Filter by Winter')}>Formal</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>

      <InventoryTable socks={data.items} onRowClick={handleRowClick} />

      <div className="flex justify-center mt-4 pb-8">
        <Button onClick={handlePreviousPage} disabled={page === 1}>Previous</Button>
        <span className="mx-4">Page {page} of {totalPages}</span>
        <Button onClick={handleNextPage} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
}
