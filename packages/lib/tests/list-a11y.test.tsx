import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AnimatedList, AnimatedListItem } from "../src/components/display/list/list";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

describe("AnimatedList a11y", () => {
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
                    <AnimatedListItem
                        title={<span>Release dashboard</span>}
                        titleText="Release status"
                        description={<span>Current deployment</span>}
                    >
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
