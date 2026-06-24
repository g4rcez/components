import { type ReactElement, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Autocomplete } from "../src/components/form/autocomplete/autocomplete";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderWithProvider = (ui: ReactElement) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

const languages = [
    { value: "pt-BR", label: "Portuguese" },
    { value: "en-US", label: "English" },
    { value: "es-ES", label: "Spanish" },
];

const modalLanguages = Array.from({ length: 20 }, (_, index) => ({
    value: `language-${index}`,
    label: `Language ${index}`,
}));

const ControlledAutocomplete = () => {
    const [value, setValue] = useState("");

    return (
        <form aria-label="language form">
            <Autocomplete name="language" title="Language" options={languages} value={value} onChange={(event) => setValue(event.target.value)} />
        </form>
    );
};

describe("Autocomplete selection", () => {
    beforeEach(() => {
        global.ResizeObserver = class ResizeObserver {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        } as unknown as typeof ResizeObserver;
    });

    it("keeps the selected option after clicking an item", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const { container } = renderWithProvider(
            <form>
                <Autocomplete name="language" title="Language" options={languages} onChange={onChange} />
            </form>
        );

        await user.click(screen.getByRole("combobox", { name: /language/i }));
        await user.click(await screen.findByRole("option", { name: "English" }));

        await waitFor(() => expect(screen.getByRole("combobox", { name: /language/i })).toHaveValue("English"));
        expect(container.querySelector('input[type="hidden"][name="language"]')).toHaveValue("en-US");
        expect(new FormData(container.querySelector("form") ?? undefined).get("language")).toBe("en-US");
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: "en-US" }) }));
    });

    it("keeps controlled state after clicking an item", async () => {
        const user = userEvent.setup();
        const { container } = renderWithProvider(<ControlledAutocomplete />);

        await user.click(screen.getByRole("combobox", { name: /language/i }));
        await user.click(await screen.findByRole("option", { name: "Spanish" }));

        await waitFor(() => expect(screen.getByRole("combobox", { name: /language/i })).toHaveValue("Spanish"));
        expect(container.querySelector('input[type="hidden"][name="language"]')).toHaveValue("es-ES");
        expect(new FormData(screen.getByRole("form", { name: /language form/i }) as HTMLFormElement).get("language")).toBe("es-ES");
    });

    it("moves the active option with repeated arrow keys before selecting", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { container } = renderWithProvider(
            <form>
                <Autocomplete name="language" title="Language" options={languages} onChange={onChange} />
            </form>
        );

        const combobox = screen.getByRole("combobox", { name: /language/i });
        await user.click(combobox);
        await screen.findByRole("option", { name: "Portuguese" });

        await user.keyboard("[ArrowDown]");
        expect(screen.getByRole("option", { name: "Portuguese" })).toHaveAttribute("id", combobox.getAttribute("aria-activedescendant"));

        await user.keyboard("[ArrowDown]");
        expect(screen.getByRole("option", { name: "English" })).toHaveAttribute("id", combobox.getAttribute("aria-activedescendant"));

        await user.keyboard("[Enter]");

        await waitFor(() => expect(screen.getByRole("combobox", { name: /language/i })).toHaveValue("English"));
        expect(container.querySelector('input[type="hidden"][name="language"]')).toHaveValue("en-US");
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: "en-US" }) }));
    });

    it("renders every option when nested inside a modal", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <div data-component="modal">
                <Autocomplete id="modal-language" title="Language" options={modalLanguages} />
            </div>
        );

        await user.click(screen.getByRole("combobox", { name: /language/i }));

        await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(modalLanguages.length));
        expect(screen.getByRole("option", { name: "Language 19" })).toBeInTheDocument();
    });
});
