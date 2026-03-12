import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ProfessionalDetailPage } from "@/pages/ProfessionalDetailPage";
import { ProfessionalsListPage } from "@/pages/ProfessionalsList";

function AppHeader() {
  const location = useLocation();
  const onHome = location.pathname === "/";

  const navItems = [
    { id: "hero", label: "Inicio" },
    { id: "cadastro", label: "Cadastro" },
    { id: "listagem", label: "Listagem" },
    { id: "detalhes", label: "Detalhe" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center">
          <img src="/WeWorkLogo.png" alt="Logo WeWork" className="h-20 w-auto object-contain md:h-16" />
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) =>
            onHome ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-brand-500/50 hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to="/"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-brand-500/50 hover:text-white"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <img src="/WeWorkLogo.png" alt="Logo WeWork" className="h-18 w-auto object-contain md:h-14" />
          </div>
          <p className="mt-3 text-sm text-slate-400">Conectando empresas a profissionais com operacao simples e visual premium.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Produto</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Cadastro</li>
            <li>Listagem com filtros</li>
            <li>Exportacao de dados</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Empresa</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Sobre</li>
            <li>Blog</li>
            <li>Contato</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Termos de uso</li>
            <li>Politica de privacidade</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-500 md:px-6">
        © 2026 WeWork. O futuro do recrutamento esta aqui.
      </div>
    </footer>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-20 pt-20 md:px-6">
        <Routes>
          <Route path="/" element={<ProfessionalsListPage />} />
          <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  );
}
