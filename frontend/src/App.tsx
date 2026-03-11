import { Link, Navigate, Route, Routes } from "react-router-dom";

import { ProfessionalDetailPage } from "@/pages/ProfessionalDetailPage";
import { ProfessionalsListPage } from "@/pages/ProfessionalsList";

function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-brand-300/50 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Logo WeWork com dois W" className="h-10 w-10 rounded-xl" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-900">WeWork</h1>
            <p className="text-xs text-slate-500">Cadastro de profissionais</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-300/35">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">
        <Routes>
          <Route path="/" element={<ProfessionalsListPage />} />
          <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
