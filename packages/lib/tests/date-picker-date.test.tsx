import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatePicker } from "../src/components/form/date-picker/date-picker";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const date = new Date(2026, 10, 3);

describe("DatePicker date mode", () => {
    beforeEach(() => {
        global.ResizeObserver = class ResizeObserver {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        } as unknown as typeof ResizeObserver;
    });

    it("does not call onChange when an empty picker opens", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <ComponentsProvider>
                <DatePicker name="date" title="Date" locale="en-US" onChange={onChange} />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("button", { name: /open a date picker/i }));

        expect(onChange).not.toHaveBeenCalled();
    });

    it("does not call onChange when a picker with a date opens or the parent renders again", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const picker = () => (
            <ComponentsProvider>
                <DatePicker name="date" title="Date" locale="en-US" date={date} onChange={onChange} />
            </ComponentsProvider>
        );
        const { rerender } = render(picker());

        await user.click(screen.getByRole("button", { name: /open a date picker/i }));
        rerender(picker());
        rerender(picker());

        expect(onChange).not.toHaveBeenCalled();
    });

    it("calls onChange once with the clicked date", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <ComponentsProvider>
                <DatePicker name="date" title="Date" locale="en-US" date={date} onChange={onChange} />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("button", { name: /open a date picker/i }));
        await user.click(screen.getByRole("button", { name: "Tuesday, November 10, 2026" }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 10));
    });
});
