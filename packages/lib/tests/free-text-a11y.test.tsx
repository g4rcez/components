import { createRef } from "react";
import type React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Input } from "../src/components/form/input/input";
import { Textarea } from "../src/components/form/input/textarea";

type ControlProps = {
    id?: string;
    title?: string;
    required?: boolean;
    error?: string;
    feedback?: React.ReactNode;
    "aria-describedby"?: string;
    "aria-invalid"?: React.AriaAttributes["aria-invalid"];
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

type ControlCase = {
    name: string;
    renderControl: (props: ControlProps) => React.ReactElement;
};

const controls: ControlCase[] = [
    { name: "Input", renderControl: (props) => <Input {...props} /> },
    { name: "Textarea", renderControl: (props) => <Textarea {...props} /> },
];

describe.each(controls)("$name accessibility", ({ renderControl }) => {
    const renderField = (props: ControlProps = {}) =>
        render(
            <ComponentsProvider>
                {renderControl({ title: "Message", ...props })}
            </ComponentsProvider>
        );

    it("preserves caller descriptions and references populated error and feedback nodes", () => {
        renderField({
            id: "message-field",
            "aria-describedby": " caller-help message-field-error caller-help ",
            "aria-invalid": false,
            error: "The message is required.",
            feedback: "Use at least one sentence.",
        });

        const control = screen.getByRole("textbox", { name: "Message" });
        const describedBy = control.getAttribute("aria-describedby")?.split(/\s+/);

        expect(control).toHaveAttribute("aria-invalid", "true");
        expect(describedBy).toEqual(["caller-help", "message-field-error", "message-field-feedback"]);
        expect(document.getElementById("message-field-error")).toHaveTextContent("The message is required.");
        expect(document.getElementById("message-field-feedback")).toHaveTextContent("Use at least one sentence.");
    });

    it("omits empty internal descriptions and preserves explicit caller invalid state", () => {
        const { rerender } = renderField({
            id: "message-field",
            "aria-describedby": " caller-help   caller-details caller-help ",
        });

        const control = screen.getByRole("textbox", { name: "Message" });
        expect(control).toHaveAttribute("aria-describedby", "caller-help caller-details");
        expect(control).not.toHaveAttribute("aria-invalid");

        rerender(
            <ComponentsProvider>
                {renderControl({
                    id: "message-field",
                    title: "Message",
                    "aria-describedby": "caller-help",
                    "aria-invalid": false,
                })}
            </ComponentsProvider>
        );
        expect(control).toHaveAttribute("aria-invalid", "false");

        rerender(
            <ComponentsProvider>
                {renderControl({
                    id: "message-field",
                    title: "Message",
                    "aria-describedby": "caller-help",
                    "aria-invalid": true,
                })}
            </ComponentsProvider>
        );

        expect(control).toHaveAttribute("aria-invalid", "true");
    });

    it("exposes native invalidity after blur and clears it after correcting the value", async () => {
        const user = userEvent.setup();
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        const onChange = vi.fn();
        const { rerender } = renderField({
            id: "required-field",
            required: true,
            "aria-describedby": "required-help",
            "aria-invalid": false,
            onFocus,
            onBlur,
            onChange,
        });

        const control = screen.getByRole("textbox", { name: "Message" });
        expect((control as HTMLInputElement | HTMLTextAreaElement).validity.valid).toBe(false);
        expect(control).toHaveAttribute("aria-invalid", "false");
        expect(control).toHaveAttribute("aria-describedby", "required-help");

        await user.click(control);
        await user.tab();

        expect(control).toHaveAttribute("data-initialized", "true");
        expect(control).toHaveAttribute("aria-invalid", "true");
        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);

        await user.click(control);
        await user.type(control, "A valid message.");
        expect(onChange).toHaveBeenCalled();
        await user.tab();

        expect(control).toHaveAttribute("aria-invalid", "false");

        rerender(
            <ComponentsProvider>
                {renderControl({
                    id: "required-field",
                    title: "Message",
                    required: true,
                    "aria-describedby": "required-help",
                    onFocus,
                    onBlur,
                    onChange,
                })}
            </ComponentsProvider>
        );

        expect(control).not.toHaveAttribute("aria-invalid");
    });
});

describe("free-text forwarded refs", () => {
    it("forwards the Input ref to the native control", () => {
        const ref = createRef<HTMLInputElement>();
        render(
            <ComponentsProvider>
                <Input title="Message" ref={ref} />
            </ComponentsProvider>
        );

        expect(ref.current).toBe(screen.getByRole("textbox", { name: "Message" }));
    });

    it("forwards the Textarea ref to the native control", () => {
        const ref = createRef<HTMLTextAreaElement>();
        render(
            <ComponentsProvider>
                <Textarea title="Message" ref={ref} />
            </ComponentsProvider>
        );

        expect(ref.current).toBe(screen.getByRole("textbox", { name: "Message" }));
    });
});
