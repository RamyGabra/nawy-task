'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  pageSize: number;
  total: number;
}

export function PaginationControls({
  currentPage,
  pageSize,
  total,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const updatePageSize = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', newPageSize.toString());
    params.set('page', '1'); // Reset to first page when changing page size
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="sticky bottom-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white rounded-lg shadow-lg border-t border-gray-200">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-700 font-medium">
          Items per page:
        </label>
        <select
          value={pageSize}
          onChange={(e) => updatePageSize(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors duration-200 cursor-pointer"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:shadow-none"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {(() => {
            // Show fewer pages on mobile (3), more on desktop (5)
            const maxPages = isMobile ? 3 : 5;
            
            let pageNumbers: number[] = [];
            
            if (totalPages <= maxPages) {
              // Show all pages if total is less than max
              pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else {
              // Show pages around current page
              if (currentPage <= Math.ceil(maxPages / 2)) {
                // Near the beginning
                pageNumbers = Array.from({ length: maxPages }, (_, i) => i + 1);
              } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                // Near the end
                pageNumbers = Array.from({ length: maxPages }, (_, i) => totalPages - maxPages + i + 1);
              } else {
                // In the middle
                const start = currentPage - Math.floor(maxPages / 2);
                pageNumbers = Array.from({ length: maxPages }, (_, i) => start + i);
              }
            }

            return pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => updatePage(pageNum)}
                className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm cursor-pointer'
                }`}
              >
                {pageNum}
              </button>
            ));
          })()}
        </div>

        <button
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:shadow-none"
        >
          Next
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages} ({total} total)
      </div>
    </div>
  );
}

