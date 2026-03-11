import { fireEvent, render, screen } from "@testing-library/react";

import { ProfessionalForm } from "@/features/professionals/Form";

describe("ProfessionalForm", () => {
  it("valida regra de datas", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProfessionalForm onCancel={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Maria" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "maria@empresa.com" } });
    fireEvent.change(screen.getByLabelText("Cargo"), { target: { value: "QA" } });
    fireEvent.change(screen.getByLabelText("Departamento"), { target: { value: "Tecnologia" } });
    fireEvent.change(screen.getByLabelText("Telefone"), { target: { value: "11999999999" } });
    fireEvent.change(screen.getByLabelText("Data de inicio"), { target: { value: "2026-02-01" } });
    fireEvent.change(screen.getByLabelText("Data de vencimento de contrato"), {
      target: { value: "2026-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar profissional" }));

    expect(
      await screen.findByText("Data de vencimento deve ser maior ou igual a data de inicio"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
