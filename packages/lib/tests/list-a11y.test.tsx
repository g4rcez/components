import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AnimatedList, AnimatedListItem } from "../src/components/display/list/list";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

describe("AnimatedList a11y", () => {
    afterEach(() => vi.restoreAllMocks());
    it("keeps details through dismissal, restores focus, and opens a different item", async () => {
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
            return this.closest('[data-component="modal"]') ? new DOMRect(20, 20, 600, 300) : new DOMRect(40, 400, 400, 80);
        });
        const user = userEvent.setup();
        render(
            <AnimatedList>
                <AnimatedListItem title="Alpha" description="First item">
                    Alpha details
                </AnimatedListItem>
                <AnimatedListItem title="Beta" description="Second item">
                    Beta details
                </AnimatedListItem>
            </AnimatedList>
        );
        const action = screen.getByRole("button", { name: "Open details for Alpha" });
        await user.click(action);
        const dialog = await screen.findByRole("dialog", { name: "Alpha" });
        await user.click(within(dialog).getByRole("button", { name: "Close" }));
        expect(dialog).toHaveTextContent("Alpha details");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        expect(action).toHaveFocus();
        await user.click(screen.getByRole("button", { name: "Open details for Beta" }));
        expect(await screen.findByRole("dialog", { name: "Beta" })).toHaveTextContent("Beta details");
        await user.keyboard("[Escape]");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("uses the provider action label to open string-titled details", async () => {
        const user = userEvent.setup();

        render(
            <ComponentsProvider
                map={{
                    listCloseDetails: "Dismiss details",
                    listOpenDetails: (title) => `Read ${title}`,
                }}
            >
                <AnimatedList>
                    <AnimatedListItem title="Alpha" description="First item">
                        Alpha details
                    </AnimatedListItem>
                </AnimatedList>
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("button", { name: "Read Alpha" }));

        expect(await screen.findByRole("dialog", { name: "Alpha" })).toBeInTheDocument();
    });

    it("uses rendered titles and descriptions for ReactNode actions", async () => {
        const user = userEvent.setup();

        render(
            <AnimatedList translations={{ listOpenDetails: (title) => `Read ${title}` }}>
                <AnimatedListItem
                    avatar={<span aria-hidden="true">Avatar</span>}
                    title={
                        <>
                            <span>React</span> <strong>widget</strong>
                        </>
                    }
                    description={
                        <>
                            <em>Current</em> state
                        </>
                    }
                >
                    Widget details
                </AnimatedListItem>
            </AnimatedList>
        );

        const actions = screen.getAllByRole("button", { name: "React widget", description: "Current state" });
        expect(actions).toHaveLength(2);
        expect(actions[0]).toHaveAccessibleName("React widget");
        expect(actions[1]).toHaveAccessibleDescription("Current state");

        await user.click(actions[1]);

        const dialog = await screen.findByRole("dialog", { name: "React widget" });
        expect(dialog).toHaveTextContent("Current state");
        expect(document.body.textContent).not.toContain("[object Object]");
    });

    it("uses titleText for localized actions with complex titles", async () => {
        const user = userEvent.setup();

        render(
            <ComponentsProvider map={{ listOpenDetails: (title) => `Read ${title}` }}>
                <AnimatedList>
                    <AnimatedListItem title={<span>Release dashboard</span>} titleText="Release status" description={<span>Current deployment</span>}>
                        Deployment details
                    </AnimatedListItem>
                </AnimatedList>
            </ComponentsProvider>
        );

        const action = screen.getByRole("button", { name: "Read Release status", description: "Current deployment" });
        await user.click(action);

        expect(await screen.findByRole("dialog", { name: "Release dashboard" })).toBeInTheDocument();
    });
});
