import { Apartment, ApartmentListResponse, CreateApartmentDTO } from '@/types/apartment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getApartments(limit?: number, offset?: number, searchTerm?: string): Promise<ApartmentListResponse> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset !== undefined) params.append('offset', offset.toString());
  if (searchTerm && searchTerm.trim()) params.append('q', searchTerm.trim());
  
  const url = `${API_BASE_URL}/apartments${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch apartments');
  }

  const data = await response.json();
  return data.data;
}

export async function getApartmentById(id: number): Promise<Apartment> {
  const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch apartment');
  }

  const data = await response.json();
  return data.data;
}

export async function createApartment(apartmentData: CreateApartmentDTO): Promise<Apartment> {
  const response = await fetch(`${API_BASE_URL}/apartments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apartmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error || data.message || 'Failed to create apartment';
    throw new Error(errorMessage);
  }

  return data.data;
}

