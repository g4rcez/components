import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../src/components/core/button/button";
import { Autocomplete } from "../src/components/form/autocomplete/autocomplete";
import { Checkbox } from "../src/components/form/checkbox/checkbox";
import { DatePicker } from "../src/components/form/date-picker/date-picker";
import { Input } from "../src/components/form/input/input";
import { Textarea } from "../src/components/form/input/textarea";
import { MultiSelect } from "../src/components/form/multi-select/multi-select";
import { Select } from "../src/components/form/select/select";
import { Switch } from "../src/components/form/switch/switch";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderWithProvider = (ui: React.ReactElement) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

const options = [
    { label: "English", value: "en" },
    { label: "Portuguese", value: "pt" },
];

describe("form field sizes", () => {
    it("matches Input sizes to the corresponding Button sizes", () => {
        const sizes = ["big", "default", "min", "small", "tiny"] as const;
        const { container } = renderWithProvider(
            <div>
                {sizes.map((size) => (
                    <div key={size}>
                        <Input aria-label={`${size} input`} size={size} />
                        <Button aria-label={`${size} button`} size={size} />
                    </div>
                ))}
            </div>
        );

        for (const size of sizes) {
            expect(screen.getByLabelText(`${size} input`)).toHaveClass(`__free-text--size-${size}`);
            expect(screen.getByLabelText(`${size} input`).closest("fieldset")).toHaveClass(`__input-field--size-${size}`);
            expect(screen.getByLabelText(`${size} button`)).toHaveClass(`__button--size-${size}`);
        }

        const tokens = readFileSync(resolve(__dirname, "../src/styles/tokens.css"), "utf8");
        const tokenValue = (name: string) => {
            const value = tokens.match(new RegExp(`--var-${name}:\\s*([^;]+);`))?.[1];
            expect(value, `Missing --var-${name}`).toBeDefined();
            return value;
        };

        for (const size of sizes) {
            const buttonToken = size === "default" ? "button-height" : `button-${size}-height`;
            const inputToken = size === "default" ? "free-text-control-height" : `free-text-${size}-control-height`;
            expect(tokenValue(inputToken)).toBe(tokenValue(buttonToken));
        }

        expect(container.querySelectorAll(".__free-text")).toHaveLength(sizes.length);
    });

    it("applies shared size classes to all form controls", () => {
        const { container } = renderWithProvider(
            <div>
                <Autocomplete title="Autocomplete" size="big" options={options} />
                <MultiSelect title="MultiSelect" size="default" options={options} />
                <DatePicker title="DatePicker" size="min" />
                <Select title="Select" size="small" options={options} />
                <Checkbox size="tiny">Checkbox</Checkbox>
                <Switch size="small">Switch</Switch>
            </div>
        );

        expect(container.querySelector(".__autocomplete--size-big")).toBeInTheDocument();
        expect(container.querySelector(".__multi-select--size-default")).toBeInTheDocument();
        expect(container.querySelector(".__input-field--size-min")).toBeInTheDocument();
        expect(container.querySelector(".__select--size-small")).toBeInTheDocument();
        expect(container.querySelector(".__checkbox--size-tiny")).toBeInTheDocument();
        expect(container.querySelector(".__switch--size-small")).toBeInTheDocument();
    });

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
