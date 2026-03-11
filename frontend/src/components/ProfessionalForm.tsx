import { useState } from "react";
import type { Professional, ProfessionalInput, ProfessionalStatus } from "../types/professional";

const initial: ProfessionalInput = {
  nome: "",
  email: "",
  cargo: "",
  departamento: "",
  data_inicio: "",
  data_vencimento_contrato: "",
  telefone: "",
  observacoes: "",
  status: "ativo",
};

interface Props {
  onSubmit: (payload: ProfessionalInput) => Promise<void>;
  editing?: Professional | null;
  onCancel?: () => void;
}

export function ProfessionalForm({ onSubmit, editing, onCancel }: Props) {
  const [form, setForm] = useState<ProfessionalInput>(editing ? { ...editing } : initial);
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof ProfessionalInput>(key: K, value: ProfessionalInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      if (!editing) setForm(initial);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
      <input required className="rounded border p-2" placeholder="Nome" value={form.nome} onChange={(e) => updateField("nome", e.target.value)} />
      <input required type="email" className="rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
      <input required className="rounded border p-2" placeholder="Cargo" value={form.cargo} onChange={(e) => updateField("cargo", e.target.value)} />
      <input required className="rounded border p-2" placeholder="Departamento" value={form.departamento} onChange={(e) => updateField("departamento", e.target.value)} />
      <input required type="date" className="rounded border p-2" value={form.data_inicio} onChange={(e) => updateField("data_inicio", e.target.value)} />
      <input required type="date" className="rounded border p-2" value={form.data_vencimento_contrato} onChange={(e) => updateField("data_vencimento_contrato", e.target.value)} />
      <input required className="rounded border p-2" placeholder="Telefone" value={form.telefone} onChange={(e) => updateField("telefone", e.target.value)} />
      <select
        className="rounded border p-2"
        value={form.status}
        onChange={(e) => updateField("status", e.target.value as ProfessionalStatus)}
      >
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
        <option value="ferias">Ferias</option>
        <option value="afastado">Afastado</option>
      </select>
      <textarea
        className="rounded border p-2 md:col-span-2"
        placeholder="Observacoes"
        value={form.observacoes}
        onChange={(e) => updateField("observacoes", e.target.value)}
      />
      <div className="flex gap-2 md:col-span-2">
        <button
          type="submit"
          className="rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-700 disabled:opacity-50"
          disabled={saving}
        >
          {editing ? "Salvar edicao" : "Cadastrar"}
        </button>
        {editing && (
          <button type="button" className="rounded border px-4 py-2" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
