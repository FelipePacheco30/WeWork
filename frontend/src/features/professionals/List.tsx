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

export function ProfessionalsListTable({ items, onEdit, onView, onDelete }: ProfessionalsListTableProps) {
  const columns: Array<DataColumn<Professional>> = [
    {
      key: "nome",
      header: "Profissional",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.nome}</p>
          <p className="text-xs text-slate-500">{item.email}</p>
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
      render: (item) => <span className="font-medium text-brand-300">{formatDate(item.data_vencimento_contrato)}</span>,
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
        <div className="flex flex-wrap gap-1">
          <Button variant="ghost" className="text-slate-200 hover:bg-white/10" onClick={() => onEdit(item)} aria-label={`Editar ${item.nome}`}>
            Editar
          </Button>
          <Button variant="secondary" className="bg-transparent text-slate-200 hover:bg-white/10" onClick={() => onView(item)}>
            Detalhe
          </Button>
          <Link to={`/professionals/${item.id}`} className="inline-flex items-center px-2 py-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200">
            Pagina
          </Link>
          <Button variant="danger" onClick={() => onDelete(item.id)} aria-label={`Inativar ${item.nome}`}>
            Inativar
          </Button>
        </div>
      ),
      className: "w-72",
    },
  ];

  return <DataTable columns={columns} data={items} rowKey={(item) => item.id} emptyLabel="Nenhum profissional encontrado." />;
}
