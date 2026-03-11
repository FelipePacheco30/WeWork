export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src="/logo.svg" alt="Logo WeWork com dois W" className="h-9 w-9" />
      <div>
        <h1 className="text-xl font-bold text-slate-800">WeWork</h1>
        <p className="text-xs text-slate-500">Cadastro de profissionais</p>
      </div>
    </div>
  );
}
