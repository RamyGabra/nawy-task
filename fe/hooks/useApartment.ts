import { useQuery } from '@tanstack/react-query';
import { getApartmentById } from '@/lib/api';
import { Apartment } from '@/types/apartment';

export function useApartment(id: number) {
  return useQuery<Apartment>({
    queryKey: ['apartment', id],
    queryFn: () => getApartmentById(id),
    enabled: !!id && !isNaN(id),
  });
}

