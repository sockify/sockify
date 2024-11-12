import { Button } from "@/components/ui/button";
import { Search } from "lucide-react"; // Import the Search icon
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"; // Import ShadCN UI dropdown components
import InventoryTable from '@/components/InventoryTable';
//import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSocks } from '@/api/inventory/queries'; // Importing the useQuery hooks for fetching socks

export default function AdminInventoryPage() {
  const navigate = useNavigate(); // This is the correct way to use navigate in react-router-dom

  // Pagination settings (you can dynamically update these)
  const limit = 10;
  const offset = 0;

  // Fetching socks using the `useGetSocks` hook with pagination
  const { data, error, isLoading } = useGetSocks(limit, offset);
  console.log(data);

  // If the data is loading, show a loading indicator
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If there's an error fetching data, show an error message
  if (error) {
    return <div>Error fetching socks: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  // Handle the case where no socks are available
  if (!data || !data.items || data.items.length === 0) {
    return <div>No socks available in the inventory.</div>;
  }

  // Define some mock data for the inventory items using useState
  //const [socksData, setSocksData] = useState([
  // { id: '1', name: 'Sporty Sock', category: 'Sports', price: 12.99, quantity: 100 },
  //{ id: '2', name: 'Casual Sock', category: 'Casual', price: 9.99, quantity: 50 },
  //{ id: '3', name: 'Fancy Sock', category: 'Formal', price: 15.49, quantity: 25 },
  //]);

  // Function to handle row click and navigate to sock details page
  const handleRowClick = (sockId: string) => {
    navigate(`/socks/${sockId}`); // Use navigate to go to the sock details page
  };

  return (
    <div className="admin-inventory-page">
      <div className="flex justify-between items-center">
        {/* Inventory Management Title */}
        <h1 className="text-3xl font-extrabold">Inventory Management</h1>

        {/* Add New Product Button */}
        <Button
          className="ml-auto" // This will push the button to the right side
          onClick={() => console.log('Navigate to Add New Product page')} // Add action for adding a new product
        >
          Add New Product
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter flex items-center mt-4">

        {/* Search Bar */}
        <div className="relative w-full">
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" size={20} />
          </div>
          {/* Input Field */}
          <input
            type="text"
            placeholder="Search by product name or ID"
            className="search-bar pl-10 w-full py-2 px-4 border border-gray-300 rounded-md"
          />
        </div>

        {/* Disabled Filter Dropdown Menu */}
        <div className="ml-4">
          <DropdownMenu>
            {/* The Trigger button is disabled */}
            <DropdownMenuTrigger asChild>
              <Button disabled className="category-filter">
                Filter by category
                <ChevronDown className="ml-2" /> {/* Icon with margin to the left */}
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

      {/* Pass the handleRowClick function as a prop to InventoryTable */}
      <InventoryTable socks={data.items} onRowClick={handleRowClick} />
    </div>
  );
}
