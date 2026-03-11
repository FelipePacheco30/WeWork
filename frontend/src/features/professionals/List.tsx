import { Link } from "react-router-dom";

import { Button } from "@/components/Button";
import { DataTable, type DataColumn } from "@/components/DataTable";
import type { Professional } from "@/types/professional";

interface ProfessionalsListTableProps {
  items: Professional[];
  onEdit: (item: Professional) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("pt-BR");
}

export function ProfessionalsListTable({ items, onEdit, onDelete }: ProfessionalsListTableProps) {
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
      key: "vencimento",
      header: "Vencimento",
      render: (item) => <span className="font-medium text-brand-900">{formatDate(item.data_vencimento_contrato)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className="rounded-full bg-brand-300/40 px-2 py-1 text-xs font-semibold capitalize text-brand-900">
          {item.status}
        </span>
      ),
    },
    {
      key: "acoes",
      header: "Acoes",
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" onClick={() => onEdit(item)} aria-label={`Editar ${item.nome}`}>
            Editar
          </Button>
          <Link
            to={`/professionals/${item.id}`}
            className="inline-flex items-center rounded-xl px-2 py-1.5 text-sm font-semibold text-brand-900 hover:bg-brand-50"
          >
            Ver
          </Link>
          <Button variant="danger" onClick={() => onDelete(item.id)} aria-label={`Inativar ${item.nome}`}>
            Inativar
          </Button>
        </div>
      ),
      className: "w-56",
    },
  ];

  return <DataTable columns={columns} data={items} rowKey={(item) => item.id} emptyLabel="Nenhum profissional encontrado." />;
}
