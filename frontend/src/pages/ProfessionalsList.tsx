import { useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { FilterBar } from "@/components/FilterBar";
import { Modal } from "@/components/Modal";
import { useCreateProfessional, useProfessionals, useSoftDeleteProfessional, useUpdateProfessional } from "@/hooks/useProfessionals";
import { ProfessionalForm } from "@/features/professionals/Form";
import { ProfessionalsListTable } from "@/features/professionals/List";
import { getExportCsvUrl } from "@/services/api";
import type { Professional, ProfessionalFilters } from "@/types/professional";

const defaultFilters: ProfessionalFilters = {
  page: 1,
  page_size: 10,
};

export function ProfessionalsListPage() {
  const [filters, setFilters] = useState<ProfessionalFilters>(defaultFilters);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const listQuery = useProfessionals(filters);
  const createMutation = useCreateProfessional();
  const updateMutation = useUpdateProfessional();
  const deleteMutation = useSoftDeleteProfessional();

  const csvExportUrl = useMemo(() => getExportCsvUrl(filters), [filters]);

  const items = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;
  const page = listQuery.data?.page ?? filters.page ?? 1;
  const pageSize = listQuery.data?.page_size ?? filters.page_size ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-brand-900 via-brand-700 to-brand-500 p-5 text-white shadow-panel md:p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-50/90">Gestao de profissionais</p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Painel WeWork</h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-50/90">
          Cadastro, acompanhamento de contratos e exportacao de dados com uma interface moderna e responsiva.
        </p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => setCreateModalOpen(true)}>
            Novo profissional
          </Button>
        </div>
      </div>

      <FilterBar
        initialValue={filters}
        onApply={setFilters}
        onClear={() => setFilters(defaultFilters)}
        onExport={() => window.open(csvExportUrl, "_blank", "noopener,noreferrer")}
      />

      {listQuery.isLoading ? <p className="text-sm text-slate-600">Carregando profissionais...</p> : null}
      {listQuery.isError ? <p className="text-sm text-red-600">Erro ao carregar dados. Tente novamente.</p> : null}

      <ProfessionalsListTable
        items={items}
        onEdit={(item) => setEditingProfessional(item)}
        onDelete={(id) => {
          void deleteMutation.mutateAsync(id);
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-brand-300/60 bg-white p-3">
        <p className="text-sm text-slate-600">
          Mostrando pagina {page} de {totalPages} ({total} registros)
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page ?? 1) - 1) }))}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
          >
            Proxima
          </Button>
        </div>
      </div>

      <Modal open={createModalOpen} title="Cadastrar profissional" onClose={() => setCreateModalOpen(false)}>
        <ProfessionalForm
          loading={createMutation.isPending}
          onCancel={() => setCreateModalOpen(false)}
          onSubmit={async (payload) => {
            await createMutation.mutateAsync(payload);
            setCreateModalOpen(false);
          }}
        />
      </Modal>

      <Modal open={Boolean(editingProfessional)} title="Editar profissional" onClose={() => setEditingProfessional(null)}>
        <ProfessionalForm
          initialData={editingProfessional}
          loading={updateMutation.isPending}
          onCancel={() => setEditingProfessional(null)}
          onSubmit={async (payload) => {
            if (!editingProfessional) return;
            await updateMutation.mutateAsync({ id: editingProfessional.id, payload });
            setEditingProfessional(null);
          }}
        />
      </Modal>
    </section>
  );
}
