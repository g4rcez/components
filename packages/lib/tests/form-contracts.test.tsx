import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { Form } from "../src/components/form/form/form";
import { formReset } from "../src/components/form/form/formReset";
import { Input } from "../src/components/form/input/input";
import { Textarea } from "../src/components/form/input/textarea";
import { DatePicker } from "../src/components/form/date-picker/date-picker";
import { MultiSelect } from "../src/components/form/multi-select/multi-select";
import { Switch } from "../src/components/form/switch/switch";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { useForm, formToJson } from "../src/hooks/use-form";

const multiSelectOptions = [
    { label: "Alpha", value: "alpha" },
    { label: "Bravo", value: "bravo" },
];

describe("form and input contracts", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
    });

    afterEach(() => vi.unstubAllGlobals());

    it("supports defaultChecked and synchronizes controlled Switch values", async () => {
        const user = userEvent.setup();
        const onCheck = vi.fn();
        const { rerender } = render(
            <Switch defaultChecked onCheck={onCheck}>
                Email notifications
            </Switch>
        );

        expect(screen.getByRole("switch", { name: "Email notifications" })).toHaveAttribute("aria-checked", "true");

        const ControlledSwitch = ({ checked }: { checked: boolean }) => (
            <Switch checked={checked} onCheck={onCheck}>
                Controlled notifications
            </Switch>
        );

        rerender(<ControlledSwitch checked={false} />);
        const controlled = screen.getByRole("switch", { name: "Controlled notifications" });
        expect(controlled).toHaveAttribute("aria-checked", "false");

        rerender(<ControlledSwitch checked />);
        expect(screen.getByRole("switch", { name: "Controlled notifications" })).toHaveAttribute("aria-checked", "true");

        await user.click(screen.getByRole("switch", { name: "Controlled notifications" }));
        expect(onCheck).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("switch", { name: "Controlled notifications" })).toHaveAttribute("aria-checked", "true");
    });

    it("keeps controlled MultiSelect selection owned by the parent", async () => {
        const user = userEvent.setup();
        const onChangeOptions = vi.fn();
        const ControlledMultiSelect = ({ value }: { value: string[] }) => (
            <ComponentsProvider>
                <MultiSelect title="Tags" value={value} options={multiSelectOptions} selectedLabel="chosen" onChangeOptions={onChangeOptions} />
            </ComponentsProvider>
        );
        const { rerender } = render(<ControlledMultiSelect value={["alpha"]} />);

        expect(screen.getByText("Alpha")).toBeInTheDocument();

        await user.click(screen.getByRole("combobox", { name: "Tags" }));
        await user.click(await screen.findByRole("option", { name: "Bravo" }));

        expect(onChangeOptions).toHaveBeenLastCalledWith(["alpha", "bravo"]);
        expect(screen.queryByRole("button", { name: "Remove Bravo" })).not.toBeInTheDocument();

        rerender(<ControlledMultiSelect value={[]} />);
        await waitFor(() => expect(screen.queryByRole("button", { name: "Remove Alpha" })).not.toBeInTheDocument());
        expect(screen.queryByRole("button", { name: "Click to clear the value" })).not.toBeInTheDocument();
    });

    it("updates the MultiSelect hidden value and clear action for uncontrolled changes", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ComponentsProvider>
                <MultiSelect title="Tags" defaultValue={["alpha"]} options={multiSelectOptions} />
            </ComponentsProvider>
        );

        const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"]');
        expect(hidden).not.toBeNull();
        expect(hidden).toHaveValue("alpha");
        expect(screen.getByRole("button", { name: "Click to clear the value" })).toBeInTheDocument();

        await user.click(screen.getByRole("combobox", { name: "Tags" }));
        await user.click(await screen.findByRole("option", { name: "Bravo" }));

        expect(hidden).toHaveValue("alpha,bravo");
        expect(container.querySelector('[data-shadow="true"]')).toHaveAttribute("data-value", "alpha,bravo");

        const clearButton = container.querySelector<HTMLButtonElement>('button[aria-label="Click to clear the value"]');
        expect(clearButton).not.toBeNull();
        await user.click(clearButton as HTMLButtonElement);
        expect(hidden).toHaveValue("");
        expect(screen.queryByRole("button", { name: "Click to clear the value" })).not.toBeInTheDocument();
    });

    it("keeps free-text labels associated with stable control IDs", () => {
        const { container } = render(
            <ComponentsProvider>
                <Input title="Explicit" id="explicit-id" />
                <Input title="Named" name="named-input" />
                <Textarea title="Generated" />
            </ComponentsProvider>
        );

        const fields = Array.from(container.querySelectorAll("fieldset"));
        const controls = fields.map((field) => field.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement);
        const labels = fields.map((field) => field.querySelector("label") as HTMLLabelElement);

        expect(controls[0]).toHaveAttribute("id", "explicit-id");
        expect(controls[0]).not.toHaveAttribute("name");
        expect(labels[0]).toHaveAttribute("for", "explicit-id");

        expect(controls[1]).toHaveAttribute("id", "named-input");
        expect(controls[1]).toHaveAttribute("name", "named-input");
        expect(labels[1]).toHaveAttribute("for", "named-input");

        expect(controls[2].getAttribute("id")).toBeTruthy();
        expect(labels[2]).toHaveAttribute("for", controls[2].getAttribute("id"));
        expect(controls[2]).not.toHaveAttribute("name");
    });

    it("restores native form defaults and initialization state", () => {
        const form = document.createElement("form");
        form.innerHTML = `
            <input name="text" value="initial" data-initialized="true" />
            <input name="check" type="checkbox" checked data-initialized="true" />
            <input name="radio" type="radio" checked data-initialized="true" />
            <select name="choice" data-initialized="true">
                <option value="first" selected>First</option>
                <option value="second">Second</option>
            </select>
            <textarea name="notes" data-initialized="true">initial notes</textarea>
        `;
        document.body.append(form);

        const text = form.elements.namedItem("text") as HTMLInputElement;
        const check = form.elements.namedItem("check") as HTMLInputElement;
        const radio = form.elements.namedItem("radio") as HTMLInputElement;
        const choice = form.elements.namedItem("choice") as HTMLSelectElement;
        const notes = form.elements.namedItem("notes") as HTMLTextAreaElement;
        text.value = "changed";
        check.checked = false;
        radio.checked = false;
        choice.value = "second";
        notes.value = "changed notes";

        formReset(form);

        expect(text).toHaveValue("initial");
        expect(check).toBeChecked();
        expect(radio).toBeChecked();
        expect(choice).toHaveValue("first");
        expect(notes).toHaveValue("initial notes");
        for (const element of [text, check, radio, choice, notes]) expect(element).toHaveAttribute("data-initialized", "false");
        expect(() => formReset(null)).not.toThrow();
        expect(() => formReset(undefined)).not.toThrow();
    });

    it("keeps Form submission prevented before calling the submit handler", () => {
        const onSubmit = vi.fn();
        render(
            <Form onSubmit={onSubmit}>
                <button type="submit">Submit</button>
            </Form>
        );

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0]?.[0].defaultPrevented).toBe(true);
    });

    it("preserves falsy useForm values and serializes native fields", () => {
        const schema = z.object({ enabled: z.boolean(), count: z.number(), name: z.string(), tags: z.array(z.string()) });
        const FalsyFields = () => {
            const form = useForm(schema, "falsy-form", {
                state: { enabled: false, count: 0, name: "", tags: [] },
            });
            const count = form.input("count", { value: 42 });
            const name = form.textarea("name", { value: "fallback" });
            const tags = form.multiselect("tags", { options: multiSelectOptions, value: ["fallback"] });
            return (
                <div
                    data-enabled={String(form.get("enabled"))}
                    data-count={String(count.value)}
                    data-name={String(name.value)}
                    data-tags={JSON.stringify(tags.value)}
                />
            );
        };

        const { container } = render(<FalsyFields />);
        const result = container.firstElementChild;
        expect(result).toHaveAttribute("data-enabled", "false");
        expect(result).toHaveAttribute("data-count", "0");
        expect(result).toHaveAttribute("data-name", "");
        expect(result).toHaveAttribute("data-tags", "[]");

        const nativeForm = document.createElement("form");
        nativeForm.innerHTML = '<input name="name" value="initial" /><input name="empty" value="" />';
        document.body.append(nativeForm);
        expect(formToJson(nativeForm)).toEqual({ name: "initial", empty: "" });
    });

    it("clears a controlled DatePicker display and only renders complete range nights", async () => {
        const user = userEvent.setup();
        const { container, rerender } = render(
            <ComponentsProvider locale="en-US">
                <DatePicker date={new Date(2026, 6, 14)} title="Date" name="date" />
            </ComponentsProvider>
        );
        const field = container.querySelector<HTMLInputElement>('input[data-component="date-picker"]');
        expect(field).not.toBeNull();
        await waitFor(() => expect(field).toHaveValue("07/14/2026"));

        rerender(
            <ComponentsProvider locale="en-US">
                <DatePicker title="Date" name="date" date={undefined} />
            </ComponentsProvider>
        );
        await waitFor(() => expect(field).toHaveValue(""));

        rerender(
            <ComponentsProvider locale="en-US">
                <DatePicker type="range" title="Trip" name="trip" range={{ from: new Date(2026, 6, 14), to: new Date(2026, 6, 21) }} />
            </ComponentsProvider>
        );
        await user.click(screen.getByRole("button", { name: /open a date picker/i }));
        expect(screen.getByText("7 nights")).toBeInTheDocument();

        rerender(
            <ComponentsProvider locale="en-US">
                <DatePicker type="range" title="Trip" name="trip" range={{ from: new Date(2026, 6, 14) }} />
            </ComponentsProvider>
        );
        await waitFor(() => expect(screen.queryByText("7 nights")).not.toBeInTheDocument());
    });

    it("uses a parent-controlled DatePicker value after a clear", async () => {
        const ControlledDate = () => {
            const [date, setDate] = useState<Date | undefined>(new Date(2026, 6, 14));
            return (
                <>
                    <DatePicker title="Date" name="date" date={date} onChange={setDate} />
                    <button type="button" onClick={() => setDate(undefined)}>
                        Clear date
                    </button>
                </>
            );
        };
        const { container } = render(
            <ComponentsProvider locale="en-US">
                <ControlledDate />
            </ComponentsProvider>
        );
        const input = container.querySelector<HTMLInputElement>('input[data-component="date-picker"]');
        expect(input).not.toBeNull();
        await waitFor(() => expect(input).toHaveValue("07/14/2026"));
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "Clear date" }));
        await waitFor(() => expect(input).toHaveValue(""));
    });
});
