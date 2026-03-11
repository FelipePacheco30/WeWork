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
    <div className="overflow-hidden rounded-2xl border border-brand-300/60 bg-white shadow-panel">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-brand-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-900",
                    column.className ?? "",
                  ].join(" ")}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td className="px-4 py-7 text-sm text-slate-500" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={rowKey(item)} className="hover:bg-brand-50/30">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-slate-700">
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
