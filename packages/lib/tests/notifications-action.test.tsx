import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Notifications, useNotification } from "../src/components/display/notifications/notifications";

type Options = Parameters<ReturnType<typeof useNotification>>[1];

function Trigger({ options }: { options?: Options }) {
    const notify = useNotification();
    return <button onClick={() => notify("File moved", options)}>Notify</button>;
}

const setup = (options?: Options) => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
        <Notifications>
            <Trigger options={options} />
        </Notifications>
    );
    return user;
};

/** Steps the clock in slices so React renders between timer callbacks, like a browser does. */
const advance = async (ms: number) => {
    for (let elapsed = 0; elapsed < ms; elapsed += 250) await act(() => vi.advanceTimersByTime(250));
};

describe("Notifications action", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Testing Library only advances fake timers it finds through the jest global.
        vi.stubGlobal("jest", { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) });
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("runs the action and closes the toast on click", async () => {
        const onClick = vi.fn();
        const user = setup({ action: { label: "Undo", onClick } });
        await user.click(screen.getByRole("button", { name: "Notify" }));

        await user.click(screen.getByRole("button", { name: "Undo" }));

        expect(onClick).toHaveBeenCalledTimes(1);
        await advance(1000);
        expect(screen.queryByText("File moved")).not.toBeInTheDocument();
    });

    it("keeps a toast with an action for at least 10 seconds", async () => {
        const user = setup({ action: { label: "Undo", onClick: vi.fn() } });
        await user.click(screen.getByRole("button", { name: "Notify" }));

        await advance(9000);
        expect(screen.getByText("File moved")).toBeInTheDocument();
        await advance(3000);
        expect(screen.queryByText("File moved")).not.toBeInTheDocument();
    });

    it("keeps the default 5 seconds for a toast without an action", async () => {
        const user = setup();
        await user.click(screen.getByRole("button", { name: "Notify" }));

        await advance(4000);
        expect(screen.getByText("File moved")).toBeInTheDocument();
        await advance(3000);
        expect(screen.queryByText("File moved")).not.toBeInTheDocument();
    });

    it("pauses the timer while the pointer is over the toast", async () => {
        const user = setup({ action: { label: "Undo", onClick: vi.fn() } });
        await user.click(screen.getByRole("button", { name: "Notify" }));

        await user.hover(screen.getByRole("button", { name: "Undo" }));
        await advance(30000);
        expect(screen.getByText("File moved")).toBeInTheDocument();

        await user.unhover(screen.getByRole("button", { name: "Undo" }));
        await advance(13000);
        expect(screen.queryByText("File moved")).not.toBeInTheDocument();
    });

    it("pauses the timer while the action has keyboard focus", async () => {
        const user = setup({ action: { label: "Undo", onClick: vi.fn() } });
        await user.click(screen.getByRole("button", { name: "Notify" }));
        screen.getByRole("button", { name: "Undo" });

        await user.keyboard("{F6}");
        await user.tab();
        await user.tab();
        expect(screen.getByRole("button", { name: "Undo" })).toHaveFocus();
        await advance(30000);
        expect(screen.getByText("File moved")).toBeInTheDocument();
    });
});
