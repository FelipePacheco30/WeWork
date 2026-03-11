import { useCallback, useEffect, useState } from "react";
import {
  createProfessional,
  deleteProfessional,
  listProfessionals,
  updateProfessional,
} from "../services/api";
import type { Professional, ProfessionalFilters, ProfessionalInput } from "../types/professional";

export function useProfessionals() {
  const [items, setItems] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProfessionalFilters>({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProfessionals(filters);
      setItems(data);
    } catch {
      setError("Falha ao carregar profissionais.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const create = useCallback(async (payload: ProfessionalInput) => {
    await createProfessional(payload);
    await fetchItems();
  }, [fetchItems]);

  const update = useCallback(async (id: number, payload: ProfessionalInput) => {
    await updateProfessional(id, payload);
    await fetchItems();
  }, [fetchItems]);

  const remove = useCallback(async (id: number) => {
    await deleteProfessional(id);
    await fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    create,
    update,
    remove,
    refresh: fetchItems,
  };
}
