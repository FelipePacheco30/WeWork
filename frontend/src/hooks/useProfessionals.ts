import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProfessional,
  deleteProfessional,
  deleteProfessionalPermanent,
  getProfessional,
  listProfessionals,
  patchProfessional,
  updateProfessional,
} from "@/services/api";
import type { ProfessionalFilters, ProfessionalInput } from "@/types/professional";

export const professionalsQueryKey = (filters: ProfessionalFilters) => ["professionals", filters];

export function useProfessionals(filters: ProfessionalFilters) {
  return useQuery({
    queryKey: professionalsQueryKey(filters),
    queryFn: () => listProfessionals(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: ["professional", id],
    queryFn: () => getProfessional(id),
    enabled: Boolean(id),
  });
}

export function useCreateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfessionalInput) => createProfessional(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProfessionalInput }) =>
      updateProfessional(id, payload),
    onSuccess: async (professional) => {
      await queryClient.invalidateQueries({ queryKey: ["professionals"] });
      queryClient.setQueryData(["professional", professional.id], professional);
    },
  });
}

export function usePatchProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProfessionalInput> }) =>
      patchProfessional(id, payload),
    onSuccess: async (professional) => {
      await queryClient.invalidateQueries({ queryKey: ["professionals"] });
      queryClient.setQueryData(["professional", professional.id], professional);
    },
  });
}

export function useSoftDeleteProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProfessional(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useHardDeleteProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProfessionalPermanent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}
