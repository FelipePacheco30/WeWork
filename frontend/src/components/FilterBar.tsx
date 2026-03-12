import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { ProfessionalFilters } from "@/types/professional";

interface FilterBarProps {
  initialValue: ProfessionalFilters;
  onApply: (filters: ProfessionalFilters) => void;
  onClear: () => void;
}

function buildStartFromInLastDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export function FilterBar({ initialValue, onApply, onClear }: FilterBarProps) {
  const [form, setForm] = useState<ProfessionalFilters>(initialValue);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  const quickFilters = useMemo(
    () => [
      { label: "Vencimento em 7 dias", value: { contract_due_within_days: 7 } },
      { label: "Vencimento em 30 dias", value: { contract_due_within_days: 30 } },
      { label: "Inicio nos ultimos 30 dias", value: { start_from: buildStartFromInLastDays(30) } },
    ],
    [],
  );

  return (
    <section className="space-y-4 border-y border-white/10 bg-slate-950/40 p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        <Input
          id="filter-q"
          label="Pesquisar profissional"
          value={form.q ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, q: event.target.value }))}
          placeholder="Digite nome ou email"
        />
        <Button
          variant="ghost"
          className="h-fit self-end border border-white/20 text-slate-200 hover:bg-white/10"
          onClick={() => setShowAdvanced((prev) => !prev)}
          aria-label="Abrir filtros pre-definidos"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
          </svg>
          Filtros
        </Button>
        <Button className="h-fit self-end" onClick={() => onApply({ ...form, page: 1 })}>
          Aplicar
        </Button>
      </div>

      {showAdvanced ? (
        <div className="grid grid-cols-1 gap-3 border border-white/10 bg-slate-900/50 p-4 md:grid-cols-2 xl:grid-cols-5">
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
          <Input
            id="filter-start-from"
            type="date"
            label="Data de inicio de"
            value={form.start_from ?? ""}
            onChange={(event) => setForm((prev) => ({ ...prev, start_from: event.target.value || undefined }))}
          />
          <Input
            id="filter-start-to"
            type="date"
            label="Data de inicio ate"
            value={form.start_to ?? ""}
            onChange={(event) => setForm((prev) => ({ ...prev, start_to: event.target.value || undefined }))}
          />

          <div className="xl:col-span-5">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Pre-definidos</p>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((quickFilter) => (
                <button
                  key={quickFilter.label}
                  className="border border-brand-500/50 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-300 transition hover:bg-brand-500/20"
                  onClick={() => setForm((prev) => ({ ...prev, ...quickFilter.value, page: 1 }))}
                >
                  {quickFilter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            setForm({});
            onClear();
          }}
        >
          Limpar
        </Button>
      </div>
    </section>
  );
}
