import { fireEvent, render, screen } from "@testing-library/react";

import { FilterBar } from "@/components/FilterBar";

describe("FilterBar", () => {
  it("aplica filtros e chama callback", () => {
    const onApply = vi.fn();
    render(<FilterBar initialValue={{}} onApply={onApply} onClear={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Pesquisar profissional"), { target: { value: "maria" } });
    fireEvent.click(screen.getByRole("button", { name: "Abrir filtros pre-definidos" }));
    fireEvent.change(screen.getByLabelText("Cargo"), { target: { value: "QA" } });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ q: "maria", cargo: "QA", page: 1 }));
  });
});
