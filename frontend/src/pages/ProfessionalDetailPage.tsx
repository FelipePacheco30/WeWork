import { Link, useParams } from "react-router-dom";

import { ProfessionalDetail } from "@/features/professionals/Detail";
import { useProfessional } from "@/hooks/useProfessionals";

export function ProfessionalDetailPage() {
  const { id = "" } = useParams();
  const detailQuery = useProfessional(id);

  return (
    <section className="mx-auto flex min-h-[calc(100vh-18rem)] w-full max-w-5xl flex-col justify-center gap-5 py-10">
      <div className="w-full">
        <Link to="/" className="inline-flex text-sm font-semibold text-brand-300 hover:underline">
          ← Voltar para listagem
        </Link>
      </div>

      {detailQuery.isLoading ? <p className="text-sm text-slate-400">Carregando detalhes...</p> : null}
      {detailQuery.isError ? <p className="text-sm text-red-400">Nao foi possivel carregar o profissional.</p> : null}

      {detailQuery.data ? (
        <div className="mx-auto w-full max-w-4xl">
          <ProfessionalDetail professional={detailQuery.data} />
        </div>
      ) : null}
    </section>
  );
}
