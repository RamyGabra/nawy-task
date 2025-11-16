export interface Apartment {
  id: number;
  unitName: string;
  unitNumber: string;
  price: number;
  projectName: string;
  unitLocation: string;
  area: number;
  bathrooms: number;
  bedrooms: number;
  floorNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApartmentListResponse {
  apartments: Apartment[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface CreateApartmentDTO {
  unitName: string;
  unitNumber: string;
  price: number;
  projectName: string;
  unitLocation: string;
  area: number;
  bathrooms: number;
  bedrooms: number;
  floorNumber: string;
}

