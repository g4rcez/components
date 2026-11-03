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

    it("does not call onChange again when the parent renders with the same date", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const picker = () => (
            <ComponentsProvider>
                <DatePicker name="date" title="Date" locale="en-US" date={date} onChange={onChange} />
            </ComponentsProvider>
        );
        const { rerender } = render(picker());

        await user.click(screen.getByRole("button", { name: /open a date picker/i }));
        expect(onChange).toHaveBeenCalledTimes(1);

        rerender(picker());
        rerender(picker());
        rerender(picker());

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(date);
    });
});
