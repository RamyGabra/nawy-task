import Image from 'next/image';
import { Apartment } from '@/types/apartment';

interface ApartmentDetailsProps {
  apartment: Apartment;
}

export function ApartmentDetails({ apartment }: ApartmentDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const details = [
    { label: 'Unit Name', value: apartment.unitName },
    { label: 'Unit Number', value: apartment.unitNumber },
    { label: 'Project Name', value: apartment.projectName },
    { label: 'Location', value: apartment.unitLocation },
    { label: 'Floor Number', value: apartment.floorNumber },
    { label: 'Area', value: `${apartment.area} m²` },
    { label: 'Bedrooms', value: apartment.bedrooms.toString() },
    { label: 'Bathrooms', value: apartment.bathrooms.toString() },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Apartment Image */}
      <div className="relative w-full h-64 md:h-96 bg-gray-200 overflow-hidden">
        <Image
          src="/apartment.webp"
          alt={apartment.unitName}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {apartment.unitName}
          </h1>
          <p className="text-blue-100 text-lg">{apartment.projectName}</p>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-4xl font-bold text-gray-900">
                  {formatPrice(apartment.price)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                  {apartment.unitNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {details.map((detail, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm text-gray-500 mb-1">{detail.label}</p>
                <p className="text-lg font-semibold text-gray-900">{detail.value}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
              <p>Created: {new Date(apartment.createdAt).toLocaleDateString()}</p>
              <p>Last updated: {new Date(apartment.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

