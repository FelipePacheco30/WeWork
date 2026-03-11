import axios from "axios";
import type { Professional, ProfessionalFilters, ProfessionalInput } from "../types/professional";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  timeout: 10000,
});

export async function listProfessionals(filters: ProfessionalFilters): Promise<Professional[]> {
  const response = await api.get<Professional[]>("/professionals", { params: filters });
  return response.data;
}

export async function createProfessional(payload: ProfessionalInput): Promise<Professional> {
  const response = await api.post<Professional>("/professionals", payload);
  return response.data;
}

export async function updateProfessional(id: number, payload: ProfessionalInput): Promise<Professional> {
  const response = await api.put<Professional>(`/professionals/${id}`, payload);
  return response.data;
}

export async function deleteProfessional(id: number): Promise<void> {
  await api.delete(`/professionals/${id}`);
}

export function exportProfessionalsCsv(filters: ProfessionalFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const query = params.toString();
  const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
  return `${base}/professionals/export/csv${query ? `?${query}` : ""}`;
}
