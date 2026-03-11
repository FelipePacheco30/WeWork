import { useState } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { ProfessionalFilters } from "@/types/professional";

interface FilterBarProps {
  initialValue: ProfessionalFilters;
  onApply: (filters: ProfessionalFilters) => void;
  onClear: () => void;
  onExport: () => void;
}

export function FilterBar({ initialValue, onApply, onClear, onExport }: FilterBarProps) {
  const [form, setForm] = useState<ProfessionalFilters>(initialValue);

  return (
    <section className="rounded-2xl border border-brand-300/60 bg-white/95 p-4 shadow-panel md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input
          id="filter-q"
          label="Nome ou e-mail"
          value={form.q ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, q: event.target.value }))}
          placeholder="Digite para buscar"
        />
        <Input
          id="filter-cargo"
          label="Cargo"
          value={form.cargo ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, cargo: event.target.value }))}
          placeholder="Ex: QA"
        />
        <Input
          id="filter-departamento"
          label="Departamento"
          value={form.departamento ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, departamento: event.target.value }))}
          placeholder="Ex: Tecnologia"
        />
        <Input
          id="filter-due-days"
          type="number"
          min={0}
          max={365}
          label="Contrato vencendo em (dias)"
          value={form.contract_due_within_days ?? ""}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              contract_due_within_days: event.target.value ? Number(event.target.value) : undefined,
            }))
          }
          placeholder="30"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="filter-start-from"
            type="date"
            label="Inicio de"
            value={form.start_from ?? ""}
            onChange={(event) => setForm((prev) => ({ ...prev, start_from: event.target.value || undefined }))}
          />
          <Input
            id="filter-start-to"
            type="date"
            label="Inicio ate"
            value={form.start_to ?? ""}
            onChange={(event) => setForm((prev) => ({ ...prev, start_to: event.target.value || undefined }))}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onApply({ ...form, page: 1 })}>Aplicar filtros</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setForm({});
            onClear();
          }}
        >
          Limpar
        </Button>
        <Button variant="ghost" onClick={onExport}>
          Exportar CSV
        </Button>
      </div>
    </section>
  );
}
