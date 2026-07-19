import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AnimatedList, AnimatedListItem } from "../src/components/display/list/list";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

describe("AnimatedList a11y", () => {
    it("uses provider map labels for opening and closing item details", async () => {
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

        expect(screen.getByRole("button", { name: "Dismiss details" })).toBeInTheDocument();
    });
});
