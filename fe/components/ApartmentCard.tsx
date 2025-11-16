import Link from 'next/link';
import Image from 'next/image';
import { Apartment } from '@/types/apartment';
import { FaBed, FaBath, FaRulerCombined, FaBuilding } from 'react-icons/fa';

interface ApartmentCardProps {
  apartment: Apartment;
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/apartments/${apartment.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Apartment Image */}
        <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
          <Image
            src="/apartment.webp"
            alt={apartment.unitName}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-5 flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {apartment.unitName}
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {apartment.unitNumber}
            </span>
          </div>

          <p className="text-gray-600 mb-3">{apartment.projectName}</p>
          <p className="text-sm text-gray-500 mb-3">{apartment.unitLocation}</p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(apartment.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FaRulerCombined className="text-gray-400 mr-1" size={14} />
                <p className="text-xs text-gray-500">Area</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{apartment.area} m²</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FaBed className="text-gray-400 mr-1" size={14} />
                <p className="text-xs text-gray-500">Bedrooms</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{apartment.bedrooms}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FaBath className="text-gray-400 mr-1" size={14} />
                <p className="text-xs text-gray-500">Bathrooms</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{apartment.bathrooms}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FaBuilding className="text-gray-400 mr-1" size={14} />
                <p className="text-xs text-gray-500">Floor</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{apartment.floorNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

