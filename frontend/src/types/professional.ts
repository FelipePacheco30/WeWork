export type ProfessionalStatus = "ativo" | "inativo" | "ferias" | "afastado";

export interface Professional {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  data_inicio: string;
  data_vencimento_contrato: string;
  telefone: string;
  observacoes: string;
  status: ProfessionalStatus;
}

export interface ProfessionalInput extends Omit<Professional, "id"> {}

export interface ProfessionalFilters {
  nome?: string;
  cargo?: string;
  departamento?: string;
  data_inicio_de?: string;
  data_inicio_ate?: string;
  vencendo_em_dias?: number;
}
