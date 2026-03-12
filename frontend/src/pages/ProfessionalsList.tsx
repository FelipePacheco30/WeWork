import { useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { ExportMenu } from "@/components/ExportMenu";
import { FilterBar } from "@/components/FilterBar";
import { Modal } from "@/components/Modal";
import {
  useCreateProfessional,
  useHardDeleteProfessional,
  usePatchProfessional,
  useProfessional,
  useProfessionals,
  useSoftDeleteProfessional,
  useUpdateProfessional,
} from "@/hooks/useProfessionals";
import { ProfessionalDetail } from "@/features/professionals/Detail";
import { ProfessionalForm } from "@/features/professionals/Form";
import { ProfessionalsListTable } from "@/features/professionals/List";
import { getExportCsvUrl } from "@/services/api";
import type { Professional, ProfessionalFilters } from "@/types/professional";
import { exportProfessionalsPdf } from "@/utils/export";

const defaultFilters: ProfessionalFilters = {
  page: 1,
  page_size: 10,
};

export function ProfessionalsListPage() {
  const [filters, setFilters] = useState<ProfessionalFilters>(defaultFilters);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

  const listQuery = useProfessionals(filters);
  const createMutation = useCreateProfessional();
  const updateMutation = useUpdateProfessional();
  const patchMutation = usePatchProfessional();
  const deleteMutation = useSoftDeleteProfessional();
  const hardDeleteMutation = useHardDeleteProfessional();
  const selectedQuery = useProfessional(selectedProfessionalId ?? "");

  const csvExportUrl = useMemo(() => getExportCsvUrl(filters), [filters]);

  const items = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;
  const page = listQuery.data?.page ?? filters.page ?? 1;
  const pageSize = listQuery.data?.page_size ?? filters.page_size ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selectedProfessional = selectedQuery.data ?? null;

  function smoothScrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-0 text-slate-100">
      <section id="hero" className="relative overflow-hidden bg-slate-950 px-6 py-20 md:px-12 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,90,205,0.35),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Cadastre, organize e acompanhe
              <span className="block text-brand-500">os melhores profissionais</span>
              com agilidade
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
              Uma experiencia unificada para criar registros, filtrar talentos, editar dados e exportar informacoes com um fluxo claro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="bg-brand-900 px-7 py-3 text-base" onClick={() => smoothScrollTo("cadastro")}>
                Cadastrar profissional
              </Button>
              <Button variant="secondary" className="px-7 py-3 text-base" onClick={() => smoothScrollTo("listagem")}>
                Ver listagem
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 self-end">
            <div className="border border-white/10 bg-slate-900/70 p-4">
              <p className="text-2xl font-bold text-white">{total}+</p>
              <p className="text-xs text-slate-400">Registros no pipeline</p>
            </div>
            <div className="border border-white/10 bg-slate-900/70 p-4">
              <p className="text-2xl font-bold text-white">{items.length}</p>
              <p className="text-xs text-slate-400">Na pagina atual</p>
            </div>
            <div className="border border-white/10 bg-slate-900/70 p-4">
              <p className="text-2xl font-bold text-white">{totalPages}</p>
              <p className="text-xs text-slate-400">Paginas totais</p>
            </div>
          </div>
        </div>
      </section>

      <section id="cadastro" className="border-x border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Criacao de registro</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-bold text-white">Cadastro de profissional</h2>
            <Button variant="secondary" onClick={() => smoothScrollTo("listagem")}>
              Ir para listagem
            </Button>
          </div>
          <p className="mt-3 max-w-4xl text-sm text-slate-300">
            Preencha os dados principais para iniciar o acompanhamento do ciclo contratual e manter os dados de equipe sempre atualizados.
          </p>
          <div className="mt-6 border border-white/10 bg-slate-950/50 p-5">
            <ProfessionalForm
              loading={createMutation.isPending}
              onCancel={() => smoothScrollTo("hero")}
              onSubmit={async (payload) => {
                const created = await createMutation.mutateAsync(payload);
                setSelectedProfessionalId(created.id);
                smoothScrollTo("detalhes");
              }}
            />
          </div>
        </div>
      </section>

      <section id="listagem" className="border-x border-b border-white/10 bg-slate-950 px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Listagem</p>
              <h2 className="text-3xl font-bold text-white">Profissionais cadastrados</h2>
            </div>
            <ExportMenu
              onExportCsv={() => window.open(csvExportUrl, "_blank", "noopener,noreferrer")}
              onExportPdf={() => exportProfessionalsPdf(items)}
            />
          </div>
          <FilterBar initialValue={filters} onApply={setFilters} />

          {listQuery.isLoading ? <p className="text-sm text-slate-400">Carregando profissionais...</p> : null}
          {listQuery.isError ? <p className="text-sm text-red-400">Erro ao carregar dados. Tente novamente.</p> : null}

          <ProfessionalsListTable
            items={items}
            onEdit={(item) => setEditingProfessional(item)}
            onView={(item) => {
              setSelectedProfessionalId(item.id);
              smoothScrollTo("detalhes");
            }}
            onInactivate={(item) => {
              if (item.status === "inativo") return;
              void deleteMutation.mutateAsync(item.id);
            }}
            onActivate={(item) => {
              if (item.status === "ativo") return;
              void patchMutation.mutateAsync({ id: item.id, payload: { status: "ativo" } });
            }}
            onDeletePermanent={(item) => {
              const confirmed = window.confirm(`Deseja excluir permanentemente ${item.nome}?`);
              if (!confirmed) return;
              void hardDeleteMutation.mutateAsync(item.id);
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-slate-900/50 p-3">
            <p className="text-sm text-slate-300">
              Mostrando pagina {page} de {totalPages} ({total} registros)
            </p>
            <div className="flex gap-3">
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
        </div>
      </section>

      <section id="detalhes" className="border-x border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Detalhe e edicao</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold text-white">Detalhes do profissional</h2>
            {selectedProfessional ? <Button onClick={() => setEditingProfessional(selectedProfessional)}>Editar selecionado</Button> : null}
          </div>

          {selectedQuery.isLoading ? <p className="mt-4 text-sm text-slate-400">Carregando detalhes...</p> : null}
          {selectedQuery.isError ? <p className="mt-4 text-sm text-red-400">Nao foi possivel carregar o profissional selecionado.</p> : null}
          {selectedProfessional ? (
            <div className="mt-5">
              <ProfessionalDetail professional={selectedProfessional} />
            </div>
          ) : (
            <div className="mt-5 border border-dashed border-white/20 bg-slate-900/40 p-6 text-sm text-slate-400">
              Selecione um profissional na tabela para visualizar detalhes e editar.
            </div>
          )}
        </div>
      </section>

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
    </div>
  );
}
