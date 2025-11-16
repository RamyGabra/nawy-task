import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApartment } from '@/lib/api';
import { CreateApartmentDTO } from '@/types/apartment';

export function useCreateApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apartmentData: CreateApartmentDTO) => createApartment(apartmentData),
    onSuccess: () => {
      // Invalidate and refetch all apartments queries
      queryClient.invalidateQueries({ 
        queryKey: ['apartments'],
        exact: false, 
      });
    },
  });
}

