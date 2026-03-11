import type { Professional } from "../types/professional";

interface Props {
  items: Professional[];
  onEdit: (item: Professional) => void;
  onDelete: (id: number) => Promise<void>;
}

export function ProfessionalTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white p-4 shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="p-2">Nome</th>
            <th className="p-2">Cargo</th>
            <th className="p-2">Departamento</th>
            <th className="p-2">Inicio</th>
            <th className="p-2">Vencimento</th>
            <th className="p-2">Status</th>
            <th className="p-2">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.nome}</td>
              <td className="p-2">{item.cargo}</td>
              <td className="p-2">{item.departamento}</td>
              <td className="p-2">{item.data_inicio}</td>
              <td className="p-2">{item.data_vencimento_contrato}</td>
              <td className="p-2">{item.status}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <button className="rounded border px-2 py-1" onClick={() => onEdit(item)}>
                    Editar
                  </button>
                  <button className="rounded border border-red-300 px-2 py-1 text-red-600" onClick={() => void onDelete(item.id)}>
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <td className="p-4 text-center text-slate-500" colSpan={7}>
                Nenhum profissional encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
