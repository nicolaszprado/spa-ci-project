import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Rei da Catira", () => {
  it("renders the initial vehicle listings", () => {
    render(<App />);
    expect(screen.getAllByText(/Volkswagen Fusca 1300/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Chevrolet Opala Comodoro/i).length).toBeGreaterThan(0);
  });

  it("filters listings by search text", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/buscar por modelo ou cidade/i), "Curitiba");

    expect(screen.getAllByText(/Chevrolet Opala Comodoro/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Volkswagen Fusca 1300/i)).not.toBeInTheDocument();
  });

  it("opens and closes vehicle details", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /ver detalhes de/i })[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: /Volkswagen Fusca 1300/i }).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows an empty state for unmatched searches", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/buscar por modelo ou cidade/i), "modelo inexistente");

    expect(screen.getByText(/Nenhum carro encontrado/i)).toBeInTheDocument();
  });

  it("creates a new listing from the announcement form", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /Anunciar carro/i })[0]);
    await user.type(screen.getByLabelText(/Nome do carro/i), "Chevrolet Caravan");
    await user.type(screen.getByLabelText(/Ano/i), "1988");
    await user.type(screen.getByLabelText(/Preço/i), "25000");
    await user.type(screen.getByLabelText(/Quilometragem/i), "120000");
    await user.type(screen.getByLabelText(/^Cidade/i), "Santos, SP");
    await user.type(screen.getByLabelText(/^Descrição/i), "Caravan conservada e pronta para rodar.");
    await user.click(screen.getByRole("button", { name: /Publicar anúncio/i }));

    expect(screen.getByText(/Anúncio publicado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Chevrolet Caravan/i).length).toBeGreaterThan(0);
  });

  it("filters by maximum price and minimum year", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Filtros/i }));
    await user.type(screen.getByLabelText(/Preço máximo/i), "20000");
    await user.type(screen.getByLabelText(/A partir do ano/i), "1985");

    expect(screen.queryByText(/Chevrolet Opala Comodoro/i)).not.toBeInTheDocument();
  });

  it("sorts listings by lowest price", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/Ordenar anúncios/i), "menor-preco");

    const listingNames = screen
      .getAllByRole("button", { name: /Ver detalhes de/i })
      .map((button) => button.getAttribute("aria-label"));

    expect(listingNames[0]).toContain("Chevette");
  });
});
