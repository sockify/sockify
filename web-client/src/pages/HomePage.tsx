// src/pages/HomePage.tsx
import React, { useState } from 'react';
import SockItem from '@/components/ui/sockItem';
import { useGetSocks } from '@/api/socks/queries';

const HomePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetSocks(9, (page - 1) * 9);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Socks</h1>
        <button className="bg-gray-200 p-2 rounded">Filters</button> {/* Filters button */}
      </header>

      {/* Responsive Grid for Sock Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading && <p>Loading socks...</p>}
        {error && <p>Error loading socks.</p>}
        {data?.items.map(sock => (
          <SockItem key={sock.id} sock={sock} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={handlePrevPage}
        >
          Previous
        </button>

        <span className="font-semibold">{page}</span>

        <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
