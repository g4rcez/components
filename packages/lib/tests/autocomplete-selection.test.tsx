import { type ReactElement, useState } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Autocomplete } from "../src/components/form/autocomplete/autocomplete";
import { autocompleteStyles } from "../src/components/form/autocomplete/autocomplete.styles";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderWithProvider = (ui: ReactElement) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

const MIN_OPTION_HEIGHT = 40;

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
        global.IntersectionObserver = class IntersectionObserver {
            root = null;
            rootMargin = "0px";
            thresholds = [];
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
            takeRecords = vi.fn(() => []);
        } as unknown as typeof IntersectionObserver;
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

    it("reopens the options when clicking the focused input after a selection", async () => {
        const user = userEvent.setup();
        renderWithProvider(<Autocomplete name="language" title="Language" options={languages} />);

        const combobox = screen.getByRole("combobox", { name: /language/i });
        await user.click(combobox);
        await user.click(await screen.findByRole("option", { name: "English" }));
        await waitFor(() => expect(screen.queryByRole("option", { name: "English" })).not.toBeInTheDocument());

        await user.click(combobox);

        expect(await screen.findByRole("option", { name: "English" })).toBeInTheDocument();
    });

    it.each([
        { referenceY: 100, expectedPlacement: "bottom-start" },
        { referenceY: 700, expectedPlacement: "top-start" },
    ])("uses $expectedPlacement placement when the field starts at $referenceY px", async ({ referenceY, expectedPlacement }) => {
        const user = userEvent.setup();
        const viewportWidth = vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1024);
        const viewportHeight = vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(768);
        const offsetWidth = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
            return this.dataset.floating === "true" ? 240 : 200;
        });
        const offsetHeight = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
            return this.dataset.floating === "true" ? 160 : 40;
        });
        const boundingRect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
            if (this.getAttribute("role") === "combobox") return new DOMRect(100, referenceY, 200, 40);
            if (this.dataset.floating === "true") return new DOMRect(100, referenceY + 44, 240, 160);
            return new DOMRect(0, 0, 200, 40);
        });

        try {
            renderWithProvider(<Autocomplete name="language" title="Language" options={languages} />);
            await user.click(screen.getByRole("combobox", { name: /language/i }));

            await waitFor(() => expect(document.querySelector('[data-floating="true"]')).toHaveAttribute("data-placement", expectedPlacement));
        } finally {
            viewportWidth.mockRestore();
            viewportHeight.mockRestore();
            offsetWidth.mockRestore();
            offsetHeight.mockRestore();
            boundingRect.mockRestore();
        }
    });

    it("uses the native Select interaction on touch-capable devices", async () => {
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: query === "(any-pointer: coarse)",
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));

        try {
            const user = userEvent.setup();
            const onChange = vi.fn();
            const { container } = renderWithProvider(
                <form>
                    <Autocomplete name="language" title="Language" options={languages} onChange={onChange} />
                </form>
            );

            const combobox = screen.getByRole("combobox", { name: /language/i });
            expect(combobox).toBeInstanceOf(HTMLSelectElement);

            await user.selectOptions(combobox, "en-US");

            expect(container.querySelector('input[type="hidden"][name="language"]')).toHaveValue("en-US");
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: "en-US" }) }));
        } finally {
            window.matchMedia = originalMatchMedia;
        }
    });

    it("keeps free-text dynamic options on touch-capable devices", async () => {
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: query === "(any-pointer: coarse)",
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));

        try {
            const user = userEvent.setup();
            const { container } = renderWithProvider(
                <form>
                    <Autocomplete dynamicOption name="language" title="Language" options={languages} />
                </form>
            );

            const combobox = screen.getByRole("combobox", { name: /language/i });
            expect(combobox).toBeInstanceOf(HTMLInputElement);
            await user.type(combobox, "Rust");
            await user.keyboard("[Enter]");

            expect(container.querySelector('input[type="hidden"][name="language"]')).toHaveValue("Rust");
        } finally {
            window.matchMedia = originalMatchMedia;
        }
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

    it("measures virtualized options by layout size while the panel is scaled closed", async () => {
        const observers: Array<{ targets: Set<Element>; trigger: () => void }> = [];
        const originalResizeObserver = global.ResizeObserver;
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const offsetParent = vi.spyOn(HTMLElement.prototype, "offsetParent", "get").mockReturnValue(document.body);
        const offsetHeight = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(MIN_OPTION_HEIGHT);
        const boundingRect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
            const height = this.classList.contains(autocompleteStyles.slots.item) ? 0 : MIN_OPTION_HEIGHT;
            return new DOMRect(0, 0, 200, height);
        });

        class TriggerableResizeObserver {
            readonly targets = new Set<Element>();

            constructor(private readonly callback: ResizeObserverCallback) {
                observers.push({ targets: this.targets, trigger: () => this.trigger() });
            }

            observe(target: Element) {
                this.targets.add(target);
            }

            unobserve(target: Element) {
                this.targets.delete(target);
            }

            disconnect() {
                this.targets.clear();
            }

            trigger() {
                const entries = Array.from(this.targets, (target) => ({ target })) as ResizeObserverEntry[];
                this.callback(entries, this as unknown as ResizeObserver);
            }
        }

        global.ResizeObserver = TriggerableResizeObserver as unknown as typeof ResizeObserver;

        try {
            const user = userEvent.setup();
            renderWithProvider(<Autocomplete name="language" title="Language" options={languages} />);
            await user.click(screen.getByRole("combobox", { name: /language/i }));

            const virtualList = await screen.findByTestId("virtuoso-item-list");
            const listObserver = observers.find(({ targets }) => targets.has(virtualList));
            expect(listObserver).toBeDefined();

            act(() => listObserver?.trigger());
            await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

            const loggedZeroSizedItem = consoleError.mock.calls.some((args) =>
                args.some((argument) => String(argument).includes("Zero-sized element, this should not happen"))
            );
            expect(loggedZeroSizedItem).toBe(false);
        } finally {
            global.ResizeObserver = originalResizeObserver;
            consoleError.mockRestore();
            offsetParent.mockRestore();
            offsetHeight.mockRestore();
            boundingRect.mockRestore();
        }
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
