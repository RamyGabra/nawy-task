'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApartments } from '@/hooks/useApartments';
import { ApartmentCard } from '@/components/ApartmentCard';
import { PaginationControls } from '@/components/PaginationControls';
import { CreateApartmentForm } from '@/components/CreateApartmentForm';
import { FaSearch } from 'react-icons/fa';

export function ApartmentListPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
  const searchTerm = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchTerm);

  const { data, isLoading, isError, error } = useApartments(page, pageSize, searchTerm || undefined);

  // Sync search input with URL params when they change
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset to first page when searching
    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    handleSearch('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading apartments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            Error loading apartments
          </p>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const { apartments, total } = data || { apartments: [], total: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Apartment Listings
              </h1>
              <p className="text-gray-600">Found {total} apartments</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 cursor-pointer shadow-sm"
            >
              + Create Apartment
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                name="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by project name, unit name, or unit number..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>

        {apartments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No apartments found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
              {apartments.map((apartment) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
              ))}
            </div>

            <PaginationControls
              currentPage={page}
              pageSize={pageSize}
              total={total}
            />
          </>
        )}
      </div>

      {showCreateForm && (
        <CreateApartmentForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}

