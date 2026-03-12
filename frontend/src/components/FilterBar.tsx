import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { getFilterOptions } from "@/services/api";
import type { ProfessionalFilters } from "@/types/professional";

interface FilterBarProps {
  initialValue: ProfessionalFilters;
  onApply: (filters: ProfessionalFilters) => void;
}

export function FilterBar({ initialValue, onApply }: FilterBarProps) {
  const [form, setForm] = useState<ProfessionalFilters>(initialValue);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<{ cargos: string[]; departamentos: string[] }>({
    cargos: [],
    departamentos: [],
  });

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    let cancelled = false;
    getFilterOptions().then((data) => {
      if (!cancelled) setOptions(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const search = form.q?.trim();
      onApply({
        ...form,
        q: search || undefined,
        page: 1,
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [form.q, onApply]);

  const selectedCargos = form.cargo ?? [];
  const selectedDepartamentos = form.departamento ?? [];

  const toggleCargo = (c: string) => {
    setForm((prev) => {
      const current = prev.cargo ?? [];
      const next = current.includes(c) ? current.filter((x) => x !== c) : [...current, c];
      return { ...prev, cargo: next.length ? next : undefined };
    });
  };

  const toggleDepartamento = (d: string) => {
    setForm((prev) => {
      const current = prev.departamento ?? [];
      const next = current.includes(d) ? current.filter((x) => x !== d) : [...current, d];
      return { ...prev, departamento: next.length ? next : undefined };
    });
  };

  return (
    <section className="space-y-4 border-y border-white/10 bg-slate-950/40 p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="space-y-1.5">
          <label htmlFor="filter-q" className="text-sm font-medium text-slate-300">
            Pesquisar profissional
          </label>
          <div className="relative">
            <input
              id="filter-q"
              value={form.q ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, q: event.target.value }))}
              placeholder="Digite nome ou email"
              className="w-full border border-white/15 bg-slate-900/70 px-3 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-300/30"
            />
            {form.q ? (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, q: "" }))}
                className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center border border-white/20 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Limpar pesquisa"
              >
                X
              </button>
            ) : null}
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-fit self-end border border-white/20 text-slate-200 hover:bg-white/10"
          onClick={() => setShowAdvanced((prev) => !prev)}
          aria-label="Abrir filtros"
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
        <div className="grid grid-cols-1 gap-4 border border-white/10 bg-slate-900/50 p-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Cargo</p>
            <div className="max-h-40 space-y-1.5 overflow-y-auto rounded border border-white/10 bg-slate-950/50 p-2">
              {options.cargos.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum cargo cadastrado.</p>
              ) : (
                options.cargos.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedCargos.includes(c)}
                      onChange={() => toggleCargo(c)}
                      className="h-4 w-4 rounded border-white/30 text-brand-600 focus:ring-brand-500"
                    />
                    <span>{c}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Departamento
            </p>
            <div className="max-h-40 space-y-1.5 overflow-y-auto rounded border border-white/10 bg-slate-950/50 p-2">
              {options.departamentos.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum departamento cadastrado.</p>
              ) : (
                options.departamentos.map((d) => (
                  <label key={d} className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedDepartamentos.includes(d)}
                      onChange={() => toggleDepartamento(d)}
                      className="h-4 w-4 rounded border-white/30 text-brand-600 focus:ring-brand-500"
                    />
                    <span>{d}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                const cleared = {
                  ...initialValue,
                  cargo: undefined,
                  departamento: undefined,
                  contract_due_within_days: undefined,
                  start_from: undefined,
                  start_to: undefined,
                  page: 1,
                };
                setForm(cleared);
                onApply(cleared);
              }}
            >
              Limpar
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
