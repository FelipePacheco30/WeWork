import type { Professional } from "@/types/professional";

function labelValue(label: string, value: string) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

export function ProfessionalDetail({ professional }: { professional: Professional }) {
  return (
    <section className="rounded-2xl border border-brand-300/60 bg-white p-5 shadow-panel">
      <h2 className="text-xl font-bold text-slate-800">{professional.nome}</h2>
      <p className="mt-1 text-sm text-slate-500">{professional.email}</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {labelValue("Cargo", professional.cargo)}
        {labelValue("Departamento", professional.departamento)}
        {labelValue("Telefone", professional.telefone)}
        {labelValue("Status", professional.status)}
        {labelValue("Data de inicio", new Date(`${professional.data_inicio}T00:00:00`).toLocaleDateString("pt-BR"))}
        {labelValue(
          "Vencimento contrato",
          new Date(`${professional.data_vencimento_contrato}T00:00:00`).toLocaleDateString("pt-BR"),
        )}
      </div>
      <div className="mt-5 rounded-xl bg-brand-50 p-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Observacoes</p>
        <p className="mt-1 text-sm text-slate-700">{professional.observacoes || "Sem observacoes."}</p>
      </div>
    </section>
  );
}
