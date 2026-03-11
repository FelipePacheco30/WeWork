import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renderiza marca WeWork", () => {
    render(<Logo />);
    expect(screen.getByText("WeWork")).toBeInTheDocument();
    expect(screen.getByAltText(/dois W/i)).toBeInTheDocument();
  });
});
