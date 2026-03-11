import { useState } from "react";
import type { ProfessionalFilters as Filters } from "../types/professional";

interface Props {
  onApply: (filters: Filters) => void;
  csvUrl: string;
}

export function ProfessionalFilters({ onApply, csvUrl }: Props) {
  const [filters, setFilters] = useState<Filters>({});

  const setTextField = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-semibold text-slate-700">Filtros</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input className="rounded border p-2" placeholder="Nome parcial" onChange={(e) => setTextField("nome", e.target.value)} />
        <input className="rounded border p-2" placeholder="Cargo" onChange={(e) => setTextField("cargo", e.target.value)} />
        <input className="rounded border p-2" placeholder="Departamento" onChange={(e) => setTextField("departamento", e.target.value)} />
        <input type="date" className="rounded border p-2" onChange={(e) => setTextField("data_inicio_de", e.target.value)} />
        <input type="date" className="rounded border p-2" onChange={(e) => setTextField("data_inicio_ate", e.target.value)} />
        <input
          type="number"
          min={0}
          max={365}
          className="rounded border p-2"
          placeholder="Contrato vencendo em X dias"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              vencendo_em_dias: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button className="rounded bg-slate-800 px-4 py-2 text-white" onClick={() => onApply(filters)}>
          Aplicar
        </button>
        <a className="rounded border px-4 py-2 text-slate-700" href={csvUrl}>
          Exportar CSV
        </a>
      </div>
    </section>
  );
}
