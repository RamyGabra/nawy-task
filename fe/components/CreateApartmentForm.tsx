'use client';

import { useState } from 'react';
import { useCreateApartment } from '@/hooks/useCreateApartment';
import { CreateApartmentDTO } from '@/types/apartment';
import { FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface CreateApartmentFormProps {
  onClose: () => void;
}

export function CreateApartmentForm({ onClose }: CreateApartmentFormProps) {
  const [formData, setFormData] = useState<CreateApartmentDTO>({
    unitName: '',
    unitNumber: '',
    price: 0,
    projectName: '',
    unitLocation: '',
    area: 0,
    bathrooms: 0,
    bedrooms: 0,
    floorNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const createMutation = useCreateApartment();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'area' || name === 'bathrooms' || name === 'bedrooms' 
        ? parseFloat(value) || 0 
        : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePriceIncrement = () => {
    setFormData((prev) => ({
      ...prev,
      price: (prev.price || 0) + 25000,
    }));
    if (errors.price) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };

  const handlePriceDecrement = () => {
    setFormData((prev) => ({
      ...prev,
      price: Math.max(0, (prev.price || 0) - 25000),
    }));
    if (errors.price) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };

  const handleNumberIncrement = (fieldName: 'area' | 'bedrooms' | 'bathrooms') => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: ((prev[fieldName] as number) || 0) + 1,
    }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleNumberDecrement = (fieldName: 'area' | 'bedrooms' | 'bathrooms') => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: Math.max(0, ((prev[fieldName] as number) || 0) - 1),
    }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.unitName.trim()) newErrors.unitName = 'Unit name is required';
    if (!formData.unitNumber.trim()) newErrors.unitNumber = 'Unit number is required';
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.unitLocation.trim()) newErrors.unitLocation = 'Location is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.area <= 0) newErrors.area = 'Area must be C';
    if (formData.bathrooms <= 0) newErrors.bathrooms = 'Bathrooms must be greater than 0';
    if (formData.bedrooms <= 0) newErrors.bedrooms = 'Bedrooms must be greater than 0';
    if (!formData.floorNumber.trim()) newErrors.floorNumber = 'Floor number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      // Show success banner
      setShowSuccess(true);
      setErrors({});
      
      // Reset form and close after showing success message
      setTimeout(() => {
        setFormData({
          unitName: '',
          unitNumber: '',
          price: 0,
          projectName: '',
          unitLocation: '',
          area: 0,
          bathrooms: 0,
          bedrooms: 0,
          floorNumber: '',
        });
        setShowSuccess(false);
        onClose();
      }, 3000); // Show success message for 3 seconds
    } catch (error) {
      // Error is handled by the mutation error state
      console.error('Error creating apartment:', error);
      setShowSuccess(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Apartment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Apartment created successfully!</p>
                <p className="text-sm mt-1">The apartment has been added to the listings.</p>
              </div>
            </div>
          )}
          {createMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error creating apartment</p>
              <p className="text-sm mt-1">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : 'An unexpected error occurred'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="unitName" className="block text-sm font-medium text-gray-700 mb-1">
                Unit Name *
              </label>
              <input
                type="text"
                id="unitName"
                name="unitName"
                value={formData.unitName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                  errors.unitName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Luxury Apartment A101"
              />
              {errors.unitName && (
                <p className="text-red-500 text-xs mt-1">{errors.unitName}</p>
              )}
            </div>

            <div>
              <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Unit Number *
              </label>
              <input
                type="text"
                id="unitNumber"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                  errors.unitNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., A101"
              />
              {errors.unitNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.unitNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                  errors.projectName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Marina Heights"
              />
              {errors.projectName && (
                <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>
              )}
            </div>

            <div>
              <label htmlFor="unitLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="unitLocation"
                name="unitLocation"
                value={formData.unitLocation}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                  errors.unitLocation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., New Cairo"
              />
              {errors.unitLocation && (
                <p className="text-red-500 text-xs mt-1">{errors.unitLocation}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (EGP) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  min="0"
                  step="25000"
                  className={`w-full px-3 py-2 pr-20 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  placeholder="2500000"
                />
                <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
                  <button
                    type="button"
                    onClick={handlePriceIncrement}
                    className="flex-1 px-2 border-b border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Increase price by 25000"
                  >
                    <FaChevronUp className="text-gray-600" size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={handlePriceDecrement}
                    className="flex-1 px-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Decrease price by 25000"
                  >
                    <FaChevronDown className="text-gray-600" size={12} />
                  </button>
                </div>
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area (m²) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area || ''}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={`w-full px-3 py-2 pr-20 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  placeholder="120"
                />
                <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
                  <button
                    type="button"
                    onClick={() => handleNumberIncrement('area')}
                    className="flex-1 px-2 border-b border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Increase area by 1"
                  >
                    <FaChevronUp className="text-gray-600" size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumberDecrement('area')}
                    className="flex-1 px-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Decrease area by 1"
                  >
                    <FaChevronDown className="text-gray-600" size={12} />
                  </button>
                </div>
              </div>
              {errors.area && (
                <p className="text-red-500 text-xs mt-1">{errors.area}</p>
              )}
            </div>

            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms || ''}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={`w-full px-3 py-2 pr-20 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                    errors.bedrooms ? 'border-red-500' : 'border-gray-300'
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  placeholder="3"
                />
                <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
                  <button
                    type="button"
                    onClick={() => handleNumberIncrement('bedrooms')}
                    className="flex-1 px-2 border-b border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Increase bedrooms by 1"
                  >
                    <FaChevronUp className="text-gray-600" size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumberDecrement('bedrooms')}
                    className="flex-1 px-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Decrease bedrooms by 1"
                  >
                    <FaChevronDown className="text-gray-600" size={12} />
                  </button>
                </div>
              </div>
              {errors.bedrooms && (
                <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>
              )}
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms || ''}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={`w-full px-3 py-2 pr-20 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                    errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  placeholder="2"
                />
                <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
                  <button
                    type="button"
                    onClick={() => handleNumberIncrement('bathrooms')}
                    className="flex-1 px-2 border-b border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Increase bathrooms by 1"
                  >
                    <FaChevronUp className="text-gray-600" size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumberDecrement('bathrooms')}
                    className="flex-1 px-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    aria-label="Decrease bathrooms by 1"
                  >
                    <FaChevronDown className="text-gray-600" size={12} />
                  </button>
                </div>
              </div>
              {errors.bathrooms && (
                <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>
              )}
            </div>

            <div>
              <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Floor Number *
              </label>
              <input
                type="text"
                id="floorNumber"
                name="floorNumber"
                value={formData.floorNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                  errors.floorNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10"
              />
              {errors.floorNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.floorNumber}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow-md hover:scale-105 active:scale-100 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-none disabled:hover:scale-100 transition-all duration-200 cursor-pointer"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Apartment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

