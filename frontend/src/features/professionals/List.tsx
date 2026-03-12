import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/Button";
import { DataTable, type DataColumn } from "@/components/DataTable";
import type { Professional } from "@/types/professional";

interface ProfessionalsListTableProps {
  items: Professional[];
  onEdit: (item: Professional) => void;
  onView: (item: Professional) => void;
  onInactivate: (item: Professional) => void;
  onActivate: (item: Professional) => void;
  onDeletePermanent: (item: Professional) => void;
}

function formatDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("pt-BR");
}

function isExpired(dateValue: string) {
  const target = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
}

export function ProfessionalsListTable({
  items,
  onEdit,
  onView,
  onInactivate,
  onActivate,
  onDeletePermanent,
}: ProfessionalsListTableProps) {
  const [openOptionsFor, setOpenOptionsFor] = useState<string | null>(null);
  const [openAboutFor, setOpenAboutFor] = useState<string | null>(null);

  const columns: Array<DataColumn<Professional>> = [
    {
      key: "nome",
      header: "Profissional",
      render: (item) => (
        <div>
          <p className="font-semibold text-white">{item.nome}</p>
          <p className="text-xs text-slate-200">{item.email}</p>
        </div>
      ),
    },
    { key: "cargo", header: "Cargo", render: (item) => item.cargo },
    { key: "departamento", header: "Departamento", render: (item) => item.departamento },
    {
      key: "inicio",
      header: "Data de inicio",
      render: (item) => <span className="text-slate-300">{formatDate(item.data_inicio)}</span>,
    },
    {
      key: "vencimento",
      header: "Data de vencimento",
      render: (item) => (
        <span className={["font-medium", isExpired(item.data_vencimento_contrato) ? "text-red-400" : "text-brand-300"].join(" ")}>
          {formatDate(item.data_vencimento_contrato)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-2 py-1 text-xs font-semibold capitalize text-brand-300">
          {item.status}
        </span>
      ),
    },
    {
      key: "acoes",
      header: "Acoes",
      render: (item) => (
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Button
              variant="secondary"
              className="min-w-[96px] bg-transparent text-slate-200 hover:bg-white/10"
              onClick={() =>
                setOpenOptionsFor((prev) => {
                  setOpenAboutFor(null);
                  return prev === item.id ? null : item.id;
                })
              }
            >
              Opcoes
            </Button>
            {openOptionsFor === item.id ? (
              <div className="absolute right-0 z-20 mt-1 flex min-w-[140px] flex-col border border-white/10 bg-slate-900/95 p-1">
                <button
                  className="px-3 py-2 text-left text-sm text-slate-100 transition hover:bg-white/10"
                  onClick={() => {
                    setOpenOptionsFor(null);
                    onEdit(item);
                  }}
                >
                  Editar
                </button>
                <button
                  className="px-3 py-2 text-left text-sm text-slate-100 transition hover:bg-white/10"
                  onClick={() => {
                    setOpenOptionsFor(null);
                    onInactivate(item);
                  }}
                >
                  Inativar
                </button>
                <button
                  className="px-3 py-2 text-left text-sm text-slate-100 transition hover:bg-white/10"
                  onClick={() => {
                    setOpenOptionsFor(null);
                    onActivate(item);
                  }}
                >
                  Ativar
                </button>
                <button
                  className="px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                  onClick={() => {
                    setOpenOptionsFor(null);
                    onDeletePermanent(item);
                  }}
                >
                  Excluir
                </button>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <Button
              variant="secondary"
              className="min-w-[96px] bg-transparent text-slate-200 hover:bg-white/10"
              onClick={() =>
                setOpenAboutFor((prev) => {
                  setOpenOptionsFor(null);
                  return prev === item.id ? null : item.id;
                })
              }
            >
              Sobre
            </Button>
            {openAboutFor === item.id ? (
              <div className="absolute right-0 z-20 mt-1 flex min-w-[140px] flex-col border border-white/10 bg-slate-900/95 p-1">
                <button
                  className="px-3 py-2 text-left text-sm text-slate-100 transition hover:bg-white/10"
                  onClick={() => {
                    setOpenAboutFor(null);
                    onView(item);
                  }}
                >
                  Detalhe
                </button>
                <Link
                  to={`/professionals/${item.id}`}
                  className="px-3 py-2 text-left text-sm text-brand-300 transition hover:bg-brand-500/10 hover:text-brand-200"
                  onClick={() => setOpenAboutFor(null)}
                >
                  Pagina
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ),
      className: "w-[16rem]",
    },
  ];

  return <DataTable columns={columns} data={items} rowKey={(item) => item.id} emptyLabel="Nenhum profissional encontrado." />;
}
