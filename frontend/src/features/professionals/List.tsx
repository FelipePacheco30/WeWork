import { Link } from "react-router-dom";

import { Button } from "@/components/Button";
import { DataTable, type DataColumn } from "@/components/DataTable";
import type { Professional } from "@/types/professional";

interface ProfessionalsListTableProps {
  items: Professional[];
  onEdit: (item: Professional) => void;
  onView: (item: Professional) => void;
  onDelete: (id: string) => void;
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

export function ProfessionalsListTable({ items, onEdit, onView, onDelete }: ProfessionalsListTableProps) {
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
          <Button
            variant="ghost"
            className="min-w-[88px] text-slate-200 hover:bg-white/10"
            onClick={() => onEdit(item)}
            aria-label={`Editar ${item.nome}`}
          >
            Editar
          </Button>
          <Button
            variant="secondary"
            className="min-w-[88px] bg-transparent text-slate-200 hover:bg-white/10"
            onClick={() => onView(item)}
          >
            Detalhe
          </Button>
          <Link
            to={`/professionals/${item.id}`}
            className="inline-flex min-w-[88px] items-center justify-center rounded-none border border-brand-500/60 px-4 py-2.5 text-sm font-semibold text-brand-300 transition-colors hover:bg-brand-500/10 hover:text-brand-200"
          >
            Pagina
          </Link>
          <Button variant="danger" className="min-w-[88px]" onClick={() => onDelete(item.id)} aria-label={`Inativar ${item.nome}`}>
            Inativar
          </Button>
        </div>
      ),
      className: "w-[26rem]",
    },
  ];

  return <DataTable columns={columns} data={items} rowKey={(item) => item.id} emptyLabel="Nenhum profissional encontrado." />;
}
