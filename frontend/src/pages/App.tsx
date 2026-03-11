import { useMemo, useState } from "react";
import { Logo } from "../components/Logo";
import { ProfessionalFilters } from "../components/ProfessionalFilters";
import { ProfessionalForm } from "../components/ProfessionalForm";
import { ProfessionalTable } from "../components/ProfessionalTable";
import { useProfessionals } from "../hooks/useProfessionals";
import { exportProfessionalsCsv } from "../services/api";
import type { Professional, ProfessionalFilters as Filters } from "../types/professional";

export function App() {
  const { items, loading, error, filters, setFilters, create, update, remove } = useProfessionals();
  const [editing, setEditing] = useState<Professional | null>(null);

  const csvUrl = useMemo(() => exportProfessionalsCsv(filters), [filters]);

  const handleApplyFilters = (nextFilters: Filters) => {
    setFilters(nextFilters);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4 md:p-8">
      <header className="rounded-xl bg-white p-4 shadow">
        <Logo />
      </header>

      <ProfessionalFilters onApply={handleApplyFilters} csvUrl={csvUrl} />

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold text-slate-700">
          {editing ? "Editar profissional" : "Novo profissional"}
        </h2>
        <ProfessionalForm
          editing={editing}
          onCancel={() => setEditing(null)}
          onSubmit={async (payload) => {
            if (editing) {
              await update(editing.id, payload);
              setEditing(null);
            } else {
              await create(payload);
            }
          }}
        />
      </section>

      {loading && <p className="text-sm text-slate-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ProfessionalTable items={items} onEdit={setEditing} onDelete={remove} />
    </main>
  );
}
