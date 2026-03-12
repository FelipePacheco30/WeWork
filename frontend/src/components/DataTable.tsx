import type { ReactNode } from "react";

export interface DataColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Array<DataColumn<T>>;
  data: T[];
  rowKey: (item: T) => string;
  emptyLabel?: string;
}

export function DataTable<T>({ columns, data, rowKey, emptyLabel = "Sem resultados." }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden border border-white/10 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300",
                    column.className ?? "",
                  ].join(" ")}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {data.length === 0 ? (
              <tr>
                <td className="px-4 py-7 text-sm text-slate-400" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={rowKey(item)} className="hover:bg-white/5">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-slate-200">
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
