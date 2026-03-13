import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { Professional, ProfessionalInput } from "@/types/professional";

const professionalSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    cargo: z.string().min(2, "Cargo é obrigatório"),
    departamento: z.string().min(2, "Departamento é obrigatório"),
    telefone: z.string().min(15, "Telefone inválido"),
    data_inicio: z.string().min(1, "Data de início é obrigatória"),
    data_vencimento_contrato: z.string().min(1, "Data de vencimento é obrigatória"),
    status: z.enum(["ativo", "inativo"]),
    observacoes: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.data_vencimento_contrato).getTime() >= new Date(data.data_inicio).getTime(),
    {
      message: "Data de vencimento deve ser maior ou igual à data de início",
      path: ["data_vencimento_contrato"],
    },
  )
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(data.data_vencimento_contrato);
      end.setHours(0, 0, 0, 0);
      return end.getTime() >= today.getTime();
    },
    {
      message: "Data de vencimento não pode ser no passado",
      path: ["data_vencimento_contrato"],
    },
  );

type FormData = z.infer<typeof professionalSchema>;

const initialFormValue: FormData = {
  nome: "",
  email: "",
  cargo: "",
  departamento: "",
  telefone: "",
  data_inicio: "",
  data_vencimento_contrato: "",
  status: "ativo",
  observacoes: "",
};

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const ddd = digits.slice(0, 2);
  const first = digits.slice(2, 7);
  const last = digits.slice(7, 11);

  if (!ddd) return "";
  if (!first) return `(${ddd}`;
  if (!last) return `(${ddd}) ${first}`;
  return `(${ddd}) ${first}-${last}`;
}

interface ProfessionalFormProps {
  initialData?: Professional | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: ProfessionalInput) => Promise<void>;
}

export function ProfessionalForm({ initialData, loading = false, onCancel, onSubmit }: ProfessionalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: initialFormValue,
  });

  useEffect(() => {
    if (!initialData) {
      reset(initialFormValue);
      return;
    }
    reset({
      nome: initialData.nome,
      email: initialData.email,
      cargo: initialData.cargo,
      departamento: initialData.departamento,
      telefone: initialData.telefone,
      data_inicio: initialData.data_inicio,
      data_vencimento_contrato: initialData.data_vencimento_contrato,
      status: initialData.status,
      observacoes: initialData.observacoes ?? "",
    });
  }, [initialData, reset]);

  return (
    <form
      className="grid grid-cols-1 gap-3 md:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          observacoes: values.observacoes || null,
        });
      })}
    >
      <Input id="nome" label="Nome" error={errors.nome?.message} {...register("nome")} />
      <Input id="email" label="E-mail" type="email" error={errors.email?.message} {...register("email")} />
      <Input id="cargo" label="Cargo" error={errors.cargo?.message} {...register("cargo")} />
      <Input
        id="departamento"
        label="Departamento"
        error={errors.departamento?.message}
        {...register("departamento")}
      />
      <Controller
        name="telefone"
        control={control}
        render={({ field }) => (
          <Input
            id="telefone"
            label="Telefone"
            error={errors.telefone?.message}
            value={field.value}
            onChange={(event) => field.onChange(formatPhone(event.target.value))}
          />
        )}
      />
      <div className="space-y-1.5">
        <label htmlFor="status" className="text-sm font-medium text-slate-300">
          Status
        </label>
        <select
          id="status"
          className="w-full border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-300/30"
          {...register("status")}
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
      <Input
        id="data_inicio"
        type="date"
        label="Data de início"
        error={errors.data_inicio?.message}
        {...register("data_inicio")}
      />
      <Input
        id="data_vencimento_contrato"
        type="date"
        label="Data de vencimento de contrato"
        error={errors.data_vencimento_contrato?.message}
        {...register("data_vencimento_contrato")}
      />
      <div className="space-y-1.5 md:col-span-2">
        <label htmlFor="observacoes" className="text-sm font-medium text-slate-300">
          Observações
        </label>
        <textarea
          id="observacoes"
          rows={3}
          className="w-full border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-300/30"
          {...register("observacoes")}
        />
      </div>
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <Button type="submit" disabled={isSubmitting || loading}>
          {initialData ? "Salvar alteracoes" : "Cadastrar profissional"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
