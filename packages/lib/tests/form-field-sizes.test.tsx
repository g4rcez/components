import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Autocomplete } from "../src/components/form/autocomplete/autocomplete";
import { Input } from "../src/components/form/input/input";
import { Textarea } from "../src/components/form/input/textarea";
import { MultiSelect } from "../src/components/form/multi-select/multi-select";
import { Select } from "../src/components/form/select/select";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderWithProvider = (ui: React.ReactElement) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

const options = [
    { label: "English", value: "en" },
    { label: "Portuguese", value: "pt" },
];

describe("form field sizes", () => {
    it("applies small size classes to supported field components", () => {
        const { container } = renderWithProvider(
            <div>
                <Input name="full-name" title="Full name" size="small" placeholder="Jane Doe" />
                <Textarea name="biography" title="Biography" size="small" placeholder="Tell us more" />
                <Select name="role" title="Role" size="small" options={options} placeholder="Choose a role" />
                <Autocomplete name="language" title="Language" size="small" options={options} placeholder="Choose a language" />
                <MultiSelect name="skills" title="Skills" size="small" options={options} defaultValue={["en"]} placeholder="Choose your skills" />
            </div>
        );

        const input = container.querySelector('input[name="full-name"]');
        expect(input).not.toBeNull();
        if (!input) throw new Error("Expected input[name=full-name]");
        expect(input).toHaveClass("__free-text--size-small");
        expect(input.closest("fieldset")).toHaveClass("__input-field--size-small");

        const textarea = container.querySelector('textarea[name="biography"]');
        expect(textarea).not.toBeNull();
        if (!textarea) throw new Error("Expected textarea[name=biography]");
        expect(textarea).toHaveClass("__free-text--size-small");
        expect(textarea.closest("fieldset")).toHaveClass("__input-field--size-small");

        const select = screen.getByRole("combobox", { name: "Role" });
        expect(select).toHaveClass("__select--size-small", "__free-text--size-small");
        expect(select.closest("fieldset")).toHaveClass("__select--size-small", "__input-field--size-small");

        const autocomplete = screen.getByRole("combobox", { name: "Language" });
        expect(autocomplete).toHaveClass("__autocomplete--size-small", "__free-text--size-small");
        expect(autocomplete.closest("fieldset")).toHaveClass("__autocomplete--size-small", "__input-field--size-small");

        const multiSelect = screen.getByRole("combobox", { name: "Skills" });
        expect(multiSelect).toHaveClass("__multi-select--size-small", "__free-text--size-small");
        const multiSelectFieldset = multiSelect.closest("fieldset");
        expect(multiSelectFieldset).toHaveClass("__multi-select--size-small", "__input-field--size-small");
        const multiSelectTag = multiSelectFieldset?.querySelector('[data-component="tag"]');
        expect(multiSelectTag).toHaveClass("__tag--size-tiny");

        expect(container.querySelectorAll(".__input-field--size-small")).toHaveLength(5);
    });
});
