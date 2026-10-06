import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Empty } from "../src/components/display/empty/empty";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Pagination } from "../src/components/table/pagination";

describe("component translation overrides", () => {
    it("uses per-instance strings without a provider", () => {
        render(<Empty translations={{ emptyDataMessage: "Nothing for this instance" }} />);

        expect(screen.getByText("Nothing for this instance")).toBeTruthy();
    });

    it("lets per-instance strings override provider translations", () => {
        render(
            <ComponentsProvider map={{ emptyDataMessage: "Provider empty", autocompleteEmpty: "Provider autocomplete" }}>
                <Empty translations={{ emptyDataMessage: "Instance empty" }} />
            </ComponentsProvider>
        );

        expect(screen.getByText("Instance empty")).toBeTruthy();
    });

    it("overrides standalone table component translations without a provider", () => {
        render(
            <Pagination
                current={2}
                hasNext={false}
                hasPrevious
                pages={2}
                size={10}
                totalItems={20}
                translations={{ tablePaginationPrevious: "Previous page" }}
            />
        );

        expect(screen.getByRole("button", { name: "Previous page" })).toBeTruthy();
    });
});
