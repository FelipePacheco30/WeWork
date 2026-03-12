import axios from "axios";
import type {
  FilterOptions,
  Professional,
  ProfessionalFilters,
  ProfessionalInput,
  ProfessionalsListResponse,
} from "@/types/professional";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  timeout: 10000,
});

export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await api.get<FilterOptions>("/api/v1/professionals/filter-options");
  return response.data;
}

export async function listProfessionals(
  filters: ProfessionalFilters,
): Promise<ProfessionalsListResponse> {
  const params: Record<string, unknown> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (!params[key]) params[key] = [];
        (params[key] as string[]).push(String(v));
      });
    } else {
      params[key] = value;
    }
  });
  const response = await api.get<ProfessionalsListResponse>("/api/v1/professionals", { params });
  return response.data;
}

export async function createProfessional(payload: ProfessionalInput): Promise<Professional> {
  const response = await api.post<Professional>("/api/v1/professionals", payload);
  return response.data;
}

export async function getProfessional(id: string): Promise<Professional> {
  const response = await api.get<Professional>(`/api/v1/professionals/${id}`);
  return response.data;
}

export async function updateProfessional(id: string, payload: ProfessionalInput): Promise<Professional> {
  const response = await api.put<Professional>(`/api/v1/professionals/${id}`, payload);
  return response.data;
}

export async function patchProfessional(
  id: string,
  payload: Partial<ProfessionalInput>,
): Promise<Professional> {
  const response = await api.patch<Professional>(`/api/v1/professionals/${id}`, payload);
  return response.data;
}

export async function deleteProfessional(id: string): Promise<void> {
  await api.delete(`/api/v1/professionals/${id}`);
}

export function getExportCsvUrl(filters: ProfessionalFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  const query = params.toString();
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  return `${base}/api/v1/professionals/export/csv${query ? `?${query}` : ""}`;
}
