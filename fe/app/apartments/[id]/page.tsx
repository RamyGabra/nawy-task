'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';
import { useApartment } from '@/hooks/useApartment';
import { ApartmentDetails } from '@/components/ApartmentDetails';

export default function ApartmentDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const { data: apartment, isLoading, isError, error } = useApartment(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading apartment details...</p>
        </div>
      </div>
    );
  }

  if (isError || !apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Apartment Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            {error instanceof Error
              ? error.message
              : "The apartment you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaChevronLeft className="mr-2" size={16} />
          Back to Listings
        </Link>   

        <ApartmentDetails apartment={apartment} />
      </div>
    </div>
  );
}
