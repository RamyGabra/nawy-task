import { useQuery } from '@tanstack/react-query';
import { getApartments } from '@/lib/api';
import { ApartmentListResponse } from '@/types/apartment';

export function useApartments(page: number = 1, pageSize: number = 12, searchTerm?: string) {
  const offset = (page - 1) * pageSize;

  return useQuery<ApartmentListResponse>({
    queryKey: ['apartments', page, pageSize, searchTerm || ''],
    queryFn: () => getApartments(pageSize, offset, searchTerm),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

