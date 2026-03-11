export type ProfessionalStatus = "ativo" | "inativo" | "licencia";

export interface Professional {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  telefone: string;
  data_inicio: string;
  data_vencimento_contrato: string;
  status: ProfessionalStatus;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalInput {
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  telefone: string;
  data_inicio: string;
  data_vencimento_contrato: string;
  status: ProfessionalStatus;
  observacoes?: string | null;
}

export interface ProfessionalFilters {
  page?: number;
  page_size?: number;
  q?: string;
  cargo?: string;
  departamento?: string;
  start_from?: string;
  start_to?: string;
  contract_due_within_days?: number;
}

export interface ProfessionalsListResponse {
  items: Professional[];
  total: number;
  page: number;
  page_size: number;
}
