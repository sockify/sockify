import { Button } from "@/components/ui/button";
import InventoryTable from '@/components/InventoryTable';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminInventoryPage() {
  const navigate = useNavigate(); // This is the correct way to use navigate in react-router-dom

  // Define some mock data for the inventory items using useState
  const [socksData, setSocksData] = useState([
    { id: '1', name: 'Sporty Sock', category: 'Sports', price: 12.99, quantity: 100 },
    { id: '2', name: 'Casual Sock', category: 'Casual', price: 9.99, quantity: 50 },
    { id: '3', name: 'Fancy Sock', category: 'Formal', price: 15.49, quantity: 25 },
  ]);

  // Function to handle row click and navigate to sock details page
  const handleRowClick = (sockId: string) => {
    navigate(`/socks/${sockId}`); // Use navigate to go to the sock details page
  };

  return (
    <div className="admin-inventory-page">
      <h1 className="text-3xl font-extrabold">Inventory Management</h1>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by product name or ID"
          className="search-bar"
        />

        <Button disabled className="category-filter">Filter by category</Button>
      </div>

      {/* Pass the handleRowClick function as a prop to InventoryTable */}
      <InventoryTable socks={socksData} setSocksData={setSocksData} onRowClick={handleRowClick} />
    </div>
  );
}
