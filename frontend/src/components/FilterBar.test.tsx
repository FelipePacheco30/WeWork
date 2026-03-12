import { fireEvent, render, screen } from "@testing-library/react";

import { FilterBar } from "@/components/FilterBar";

describe("FilterBar", () => {
  it("aplica filtros e chama callback", () => {
    const onApply = vi.fn();
    render(<FilterBar initialValue={{}} onApply={onApply} />);

    fireEvent.change(screen.getByLabelText("Pesquisar profissional"), { target: { value: "maria" } });
    fireEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ q: "maria", page: 1 }));
  });
});
