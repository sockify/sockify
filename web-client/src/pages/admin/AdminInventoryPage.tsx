import { Button } from "@/components/ui/button";
import InventoryTable from '@/components/InventoryTable';
import React, { useState } from 'react';

export default function AdminInventoryPage() {
  // Define some mock data for the inventory items using useState
  const [socksData, setSocksData] = useState([
    { id: '1', name: 'Sporty Sock', category: 'Sports', price: 12.99, quantity: 100 },
    { id: '2', name: 'Casual Sock', category: 'Casual', price: 9.99, quantity: 50 },
    { id: '3', name: 'Fancy Sock', category: 'Formal', price: 15.49, quantity: 25 },
  ]);

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

      <InventoryTable socks={socksData} />
    </div>
  );
}
