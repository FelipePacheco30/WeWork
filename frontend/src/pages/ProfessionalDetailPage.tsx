import { Link, useParams } from "react-router-dom";

import { ProfessionalDetail } from "@/features/professionals/Detail";
import { useProfessional } from "@/hooks/useProfessionals";

export function ProfessionalDetailPage() {
  const { id = "" } = useParams();
  const detailQuery = useProfessional(id);

  return (
    <section className="space-y-4">
      <Link to="/" className="inline-flex text-sm font-semibold text-brand-300 hover:underline">
        ← Voltar para listagem
      </Link>
      {detailQuery.isLoading ? <p className="text-sm text-slate-400">Carregando detalhes...</p> : null}
      {detailQuery.isError ? <p className="text-sm text-red-400">Nao foi possivel carregar o profissional.</p> : null}
      {detailQuery.data ? <ProfessionalDetail professional={detailQuery.data} /> : null}
    </section>
  );
}
