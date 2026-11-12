import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MorphSelect, type MorphSelectItem, type MorphSelectProps } from "../src/components/form/morph-select/morph-select";
import { filterItems, findTypeahead, matchesQuery, moveEnabled } from "../src/components/form/morph-select/morph-select.utils";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const reducedMotion = vi.hoisted(() => ({ value: true }));
vi.mock("motion/react", async (importOriginal) => ({
    ...(await importOriginal<typeof import("motion/react")>()),
    useReducedMotion: () => reducedMotion.value,
}));

const statuses: MorphSelectItem[] = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "Todo" },
    { value: "progress", label: "In progress" },
    { value: "review", label: "In review", disabled: true },
    { value: "done", label: "Done" },
    { value: "canceled", label: "Canceled" },
];

const cities: MorphSelectItem[] = Array.from({ length: 12 }, (_, index) => ({
    value: `city-${index}`,
    label: ["Lisbon", "Porto", "Madrid", "Paris", "Berlin", "Rome", "Vienna", "Prague", "Oslo", "Athens", "Dublin", "Zurich"][index],
    meta: `UTC+${index}`,
    keywords: index === 0 ? ["portugal"] : undefined,
}));

const zones: MorphSelectItem[] = [
    {
        label: "Americas",
        options: [
            { value: "sp", label: "São Paulo", meta: "UTC-3" },
            { value: "ny", label: "New York", meta: "UTC-5" },
        ],
    },
    { label: "Europe", options: [{ value: "lis", label: "Lisbon", meta: "UTC+0" }] },
];

const setup = (props: Partial<MorphSelectProps> = {}) => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const utils = render(
        <ComponentsProvider>
            <MorphSelect label="Status" items={statuses} onValueChange={onValueChange} {...props} />
        </ComponentsProvider>
    );
    return { ...utils, user, onValueChange };
};

const combo = () => screen.getByRole("combobox");
const listbox = () => screen.getByRole("listbox");
const option = (name: string | RegExp) => screen.getByRole("option", { name });
const activeLabel = () => document.getElementById(combo().getAttribute("aria-activedescendant") ?? "")?.textContent ?? null;
const openWith = async (user: ReturnType<typeof userEvent.setup>, key = "{Enter}") => {
    combo().focus();
    await user.keyboard(key);
    await screen.findByRole("listbox");
};

beforeEach(() => {
    reducedMotion.value = true;
});

describe("MorphSelect closed state", () => {
    it("is a combobox named by its label and current value", () => {
        setup({ defaultValue: "progress" });
        expect(combo()).toHaveAccessibleName("Status In progress");
        expect(combo()).toHaveAttribute("aria-haspopup", "listbox");
        expect(combo()).toHaveAttribute("aria-expanded", "false");
        expect(combo()).not.toHaveAttribute("aria-controls");
    });

    it("shows the placeholder, which can be customised", () => {
        const { unmount } = setup();
        expect(combo()).toHaveAccessibleName("Status Select");
        unmount();
        setup({ placeholder: "Pick one" });
        expect(combo()).toHaveAccessibleName("Status Pick one");
    });

    it("keeps the label for assistive technology only when hideLabel is set", () => {
        const { container } = setup({ hideLabel: true });
        expect(container.querySelector("[data-hide-label='true']")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("does not open when disabled", async () => {
        const { user } = setup({ disabled: true });
        expect(combo()).toBeDisabled();
        await user.click(combo());
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("has no axe violations, closed or open", async () => {
        const { container, user } = setup({ defaultValue: "todo" });
        expect((await axe(container)).violations).toHaveLength(0);
        await user.click(combo());
        await screen.findByRole("listbox");
        expect((await axe(container)).violations).toHaveLength(0);
    });
});

describe("MorphSelect opening", () => {
    it("opens on click, marks the selected option and points at it", async () => {
        const { user } = setup({ defaultValue: "progress" });
        await user.click(combo());
        expect(combo()).toHaveAttribute("aria-expanded", "true");
        expect(combo()).toHaveAttribute("aria-controls", listbox().id);
        expect(listbox()).toHaveAccessibleName("Status");
        expect(option("In progress")).toHaveAttribute("aria-selected", "true");
        expect(option("Todo")).toHaveAttribute("aria-selected", "false");
        expect(combo().getAttribute("aria-activedescendant")).toBe(option("In progress").id);
    });

    it.each([["{Enter}"], [" "], ["{ArrowDown}"], ["{ArrowUp}"]])("opens with %s on the selected option", async (key) => {
        const { user } = setup({ defaultValue: "done" });
        await openWith(user, key);
        expect(activeLabel()).toBe("Done");
    });

    it("opens on the first or last enabled option with Home and End", async () => {
        const { user, unmount } = setup();
        await openWith(user, "{Home}");
        expect(activeLabel()).toBe("Backlog");
        unmount();
        const second = setup();
        await openWith(second.user, "{End}");
        expect(activeLabel()).toBe("Canceled");
    });

    it("starts on the first enabled option when nothing is selected", async () => {
        const { user } = setup();
        await openWith(user);
        expect(activeLabel()).toBe("Backlog");
    });

    it("closes when the trigger is pressed again", async () => {
        const { user } = setup();
        await user.click(combo());
        await user.click(combo());
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    });

    it("closes on a press outside, without stealing focus", async () => {
        const { user } = setup();
        await user.click(combo());
        await user.click(document.body);
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(combo()).toHaveAttribute("aria-expanded", "false");
    });

    it("reflects the align prop on the surface", async () => {
        const { user, container } = setup({ align: "end" });
        await user.click(combo());
        expect(container.querySelector(".__morph-select__surface")).toHaveAttribute("data-align", "end");
    });
});

describe("MorphSelect keyboard", () => {
    it("moves with the arrows, skipping disabled options and stopping at the ends", async () => {
        const { user } = setup({ defaultValue: "progress" });
        await openWith(user);
        await user.keyboard("{ArrowDown}");
        expect(activeLabel()).toBe("Done");
        await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
        expect(activeLabel()).toBe("Canceled");
        await user.keyboard("{ArrowUp}");
        expect(activeLabel()).toBe("Done");
        await user.keyboard("{ArrowUp}");
        expect(activeLabel()).toBe("In progress");
        await user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}");
        expect(activeLabel()).toBe("Backlog");
    });

    it("jumps with Home and End", async () => {
        const { user } = setup({ defaultValue: "todo" });
        await openWith(user);
        await user.keyboard("{End}");
        expect(activeLabel()).toBe("Canceled");
        await user.keyboard("{Home}");
        expect(activeLabel()).toBe("Backlog");
    });

    it("moves eight options at a time with PageDown and PageUp", async () => {
        const many = Array.from({ length: 20 }, (_, index) => ({ value: `v${index}`, label: `Option ${index}` }));
        const { user } = setup({ items: many, searchable: false, defaultValue: "v0" });
        await openWith(user);
        await user.keyboard("{PageDown}");
        expect(activeLabel()).toBe("Option 8");
        await user.keyboard("{PageDown}{PageDown}");
        expect(activeLabel()).toBe("Option 19");
        await user.keyboard("{PageUp}");
        expect(activeLabel()).toBe("Option 11");
    });

    it.each([["{Enter}"], [" "], ["{Alt>}{ArrowUp}{/Alt}"]])("picks the active option with %s, closes and returns focus", async (key) => {
        const { user, onValueChange } = setup();
        await openWith(user);
        await user.keyboard("{ArrowDown}");
        await user.keyboard(key);
        expect(onValueChange).toHaveBeenCalledWith("todo", expect.objectContaining({ value: "todo", label: "Todo" }));
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(combo()).toHaveFocus();
        expect(combo()).toHaveAccessibleName("Status Todo");
    });

    it("closes with Escape without picking, and returns focus to the trigger", async () => {
        const { user, onValueChange } = setup({ defaultValue: "todo" });
        await openWith(user);
        await user.keyboard("{ArrowDown}{Escape}");
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(onValueChange).not.toHaveBeenCalled();
        expect(combo()).toHaveFocus();
        expect(combo()).toHaveAccessibleName("Status Todo");
    });

    it("closes with Tab without picking and lets focus move on", async () => {
        const { user, onValueChange } = setup();
        await openWith(user);
        await user.keyboard("{ArrowDown}");
        await user.tab();
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(onValueChange).not.toHaveBeenCalled();
        expect(combo()).not.toHaveFocus();
    });

    it("does not pick a disabled option, even by pressing it", async () => {
        const { user, onValueChange } = setup();
        await user.click(combo());
        expect(option("In review")).toHaveAttribute("aria-disabled", "true");
        await user.click(option("In review"));
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
});

describe("MorphSelect type-ahead", () => {
    it("jumps to the option starting with the typed text", async () => {
        const { user } = setup({ defaultValue: "backlog" });
        await openWith(user);
        await user.keyboard("d");
        expect(activeLabel()).toBe("Done");
        await user.keyboard("{Escape}");
        await openWith(user);
        await user.keyboard("ca");
        expect(activeLabel()).toBe("Canceled");
    });

    it("cycles through options sharing the first letter", async () => {
        const { user } = setup({ defaultValue: "backlog" });
        await openWith(user);
        await user.keyboard("i");
        expect(activeLabel()).toBe("In progress");
        await new Promise((resolve) => setTimeout(resolve, 520));
        await user.keyboard("i");
        expect(activeLabel()).toBe("In progress");
    });

    it("opens the list on a match when typing on the closed trigger", async () => {
        const { user } = setup();
        combo().focus();
        await user.keyboard("t");
        await screen.findByRole("listbox");
        expect(activeLabel()).toBe("Todo");
    });

    it("keeps the active option when nothing matches", async () => {
        const { user } = setup({ defaultValue: "todo" });
        await openWith(user);
        await user.keyboard("x");
        expect(activeLabel()).toBe("Todo");
    });
});

describe("MorphSelect selection", () => {
    it("picks by pressing an option, updates the trigger and reports value and option", async () => {
        const { user, onValueChange } = setup();
        await user.click(combo());
        await user.click(option("Done"));
        expect(onValueChange).toHaveBeenCalledWith("done", statuses[4]);
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(combo()).toHaveAccessibleName("Status Done");
        expect(combo()).toHaveFocus();
    });

    it("is controlled when value is given, and only reports", async () => {
        const onValueChange = vi.fn();
        const user = userEvent.setup();
        const { rerender } = render(<MorphSelect label="Status" items={statuses} value="todo" onValueChange={onValueChange} />);
        await user.click(combo());
        await user.click(option("Done"));
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(combo()).toHaveAccessibleName("Status Todo");
        rerender(<MorphSelect label="Status" items={statuses} value="done" onValueChange={onValueChange} />);
        expect(combo()).toHaveAccessibleName("Status Done");
    });

    it("treats value={null} as a controlled empty selection", () => {
        setup({ value: null, defaultValue: "todo" });
        expect(combo()).toHaveAccessibleName("Status Select");
    });

    it("works with state owned by the parent", async () => {
        const user = userEvent.setup();
        const Parent = () => {
            const [value, setValue] = useState<string | null>(null);
            return <MorphSelect label="Status" items={statuses} value={value} onValueChange={setValue} />;
        };
        render(<Parent />);
        await user.click(combo());
        await user.click(option("Backlog"));
        expect(combo()).toHaveAccessibleName("Status Backlog");
    });

    it("submits the value with a native form through the hidden input", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <form>
                <MorphSelect label="Status" name="status" items={statuses} defaultValue="todo" />
            </form>
        );
        const read = () => new FormData(container.querySelector("form")!).get("status");
        expect(read()).toBe("todo");
        await user.click(combo());
        await user.click(option("Done"));
        expect(read()).toBe("done");
    });

    it("submits an empty string when nothing is selected", () => {
        const { container } = render(
            <form>
                <MorphSelect label="Status" name="status" items={statuses} />
            </form>
        );
        expect(new FormData(container.querySelector("form")!).get("status")).toBe("");
    });

    it("renders no hidden input without a name", () => {
        const { container } = setup();
        expect(container.querySelector("input[type='hidden']")).not.toBeInTheDocument();
    });

    it("shows icons and meta text on options and on the trigger", async () => {
        const { user, container } = setup({
            items: [{ value: "a", label: "Alpha", icon: <i data-testid="alpha-icon" />, meta: "3 open" }],
            defaultValue: "a",
        });
        expect(container.querySelectorAll("[data-testid='alpha-icon']")).toHaveLength(1);
        await user.click(combo());
        expect(within(option(/Alpha/)).getByText("3 open")).toBeInTheDocument();
    });
});

describe("MorphSelect search", () => {
    it("stays a plain list up to eight options and turns search on above", async () => {
        const { user, unmount } = setup();
        await user.click(combo());
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        unmount();
        const bigger = setup({ items: cities });
        await bigger.user.click(combo());
        expect(combo().tagName).toBe("INPUT");
        expect(combo()).toHaveAttribute("aria-autocomplete", "list");
    });

    it("can be forced on or off", async () => {
        const { user, unmount } = setup({ searchable: true });
        await user.click(combo());
        expect(combo().tagName).toBe("INPUT");
        unmount();
        const off = setup({ items: cities, searchable: false });
        await off.user.click(combo());
        expect(combo().tagName).toBe("BUTTON");
    });

    it("moves the combobox to the input and makes the trigger inert while open", async () => {
        const { user, container } = setup({ items: cities });
        await user.click(combo());
        expect(combo()).toHaveFocus();
        const trigger = container.querySelector<HTMLElement>(".__morph-select__trigger")!;
        expect(trigger).toHaveAttribute("aria-hidden", "true");
        expect(trigger).toHaveAttribute("tabindex", "-1");
        expect(trigger).not.toHaveAttribute("role");
    });

    it("filters while typing and announces the number of results", async () => {
        const { user } = setup({ items: cities });
        await user.click(combo());
        await user.keyboard("in");
        expect(screen.getAllByRole("option").map((node) => node.textContent)).toEqual(["BerlinUTC+4", "DublinUTC+10"]);
        expect(screen.getByRole("status")).toHaveTextContent("2 results");
        expect(activeLabel()).toBe("BerlinUTC+4");
    });

    it("matches meta text, keywords and ignores accents and case", async () => {
        const { user } = setup({ items: cities });
        await user.click(combo());
        await user.keyboard("portugal");
        expect(screen.getAllByRole("option")).toHaveLength(1);
        expect(option(/Lisbon/)).toBeInTheDocument();
        await user.clear(combo());
        await user.keyboard("utc+11");
        expect(option(/Zurich/)).toBeInTheDocument();
    });

    it("says so when nothing matches, and offers no listbox", async () => {
        const { user } = setup({ items: cities });
        await user.click(combo());
        await user.keyboard("zzzz");
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        expect(screen.getAllByText("No matches").length).toBeGreaterThan(0);
        expect(screen.getByRole("status")).toHaveTextContent("No matches");
        expect(combo()).not.toHaveAttribute("aria-activedescendant");
    });

    it("picks the first match with Enter and resets the query", async () => {
        const { user, onValueChange } = setup({ items: cities });
        await user.click(combo());
        await user.keyboard("vie{Enter}");
        expect(onValueChange).toHaveBeenCalledWith("city-6", expect.objectContaining({ label: "Vienna" }));
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        await user.click(combo());
        expect(combo()).toHaveValue("");
        expect(screen.getAllByRole("option")).toHaveLength(12);
    });

    it("types spaces instead of picking, and leaves Home and End to the caret", async () => {
        const { user, onValueChange } = setup({ items: [...cities, { value: "ny", label: "New York" }] });
        await user.click(combo());
        await user.keyboard("new y");
        expect(combo()).toHaveValue("new y");
        expect(onValueChange).not.toHaveBeenCalled();
        await user.keyboard("{Home}{End}");
        expect(activeLabel()).toBe("New York");
    });

    it("starts a search from the first character typed on the closed trigger", async () => {
        const { user } = setup({ items: cities });
        combo().focus();
        await user.keyboard("o");
        await screen.findByRole("listbox");
        expect(combo()).toHaveValue("o");
        expect(combo()).toHaveFocus();
    });

    it("uses the search placeholder, then the selected label, then Search", async () => {
        const first = setup({ items: cities, searchPlaceholder: "Find a city" });
        await first.user.click(combo());
        expect(combo()).toHaveAttribute("placeholder", "Find a city");
        first.unmount();
        const second = setup({ items: cities, defaultValue: "city-2" });
        await second.user.click(combo());
        expect(combo()).toHaveAttribute("placeholder", "Madrid");
        second.unmount();
        const third = setup({ items: cities });
        await third.user.click(combo());
        expect(combo()).toHaveAttribute("placeholder", "Search");
    });
});

describe("MorphSelect groups", () => {
    it("labels each group by its heading and drops groups the search empties", async () => {
        const { user } = setup({ items: zones, searchable: true });
        await user.click(combo());
        const groups = screen.getAllByRole("group");
        expect(groups.map((group) => group.getAttribute("aria-labelledby"))).toHaveLength(2);
        expect(screen.getByRole("group", { name: "Americas" })).toBeInTheDocument();
        expect(screen.getByRole("group", { name: "Europe" })).toBeInTheDocument();
        await user.keyboard("york");
        expect(screen.queryByRole("group", { name: "Europe" })).not.toBeInTheDocument();
        expect(within(screen.getByRole("group", { name: "Americas" })).getAllByRole("option")).toHaveLength(1);
    });

    it("navigates across groups as one flat list", async () => {
        const { user } = setup({ items: zones, searchable: false });
        await openWith(user, "{Home}");
        expect(activeLabel()).toContain("São Paulo");
        await user.keyboard("{ArrowDown}{ArrowDown}");
        expect(activeLabel()).toContain("Lisbon");
    });

    it("matches accented labels without the accent", async () => {
        const { user } = setup({ items: zones, searchable: true });
        await user.click(combo());
        await user.keyboard("sao");
        expect(option(/São Paulo/)).toBeInTheDocument();
    });
});

describe("MorphSelect motion", () => {
    it("keeps the surface mounted until the fold finishes, then removes it", async () => {
        reducedMotion.value = false;
        const { user, container } = setup();
        await user.click(combo());
        expect(container.querySelector(".__morph-select__surface")).toBeInTheDocument();
        await user.click(option("Todo"));
        await waitFor(() => expect(container.querySelector(".__morph-select__surface")).not.toBeInTheDocument(), { timeout: 2000 });
        expect(combo()).toHaveAccessibleName("Status Todo");
    });

    it("reopens cleanly while the previous fold is still running", async () => {
        reducedMotion.value = false;
        const { user } = setup();
        await user.click(combo());
        await user.keyboard("{Escape}");
        await user.click(combo());
        await new Promise((resolve) => setTimeout(resolve, 1000));
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(combo()).toHaveAttribute("aria-expanded", "true");
    });

    it("closes instantly with reduced motion", async () => {
        const { user, container } = setup();
        await user.click(combo());
        await user.keyboard("{Escape}");
        await waitFor(() => expect(container.querySelector(".__morph-select__surface")).not.toBeInTheDocument(), { timeout: 100 });
    });
});

describe("morph-select utils", () => {
    const options = [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta", disabled: true },
        { value: "c", label: "Charlie" },
        { value: "d", label: "Delta" },
        { value: "e", label: "Echo", disabled: true },
    ];

    it("moves between enabled options without wrapping", () => {
        expect(moveEnabled(options, 0, 1)).toBe(2);
        expect(moveEnabled(options, 3, 1)).toBe(3);
        expect(moveEnabled(options, 3, -2)).toBe(0);
        expect(moveEnabled(options, 2, -5)).toBe(0);
        expect(moveEnabled(options, -1, 1)).toBe(0);
        expect(moveEnabled([], 0, 1)).toBe(-1);
    });

    it("finds type-ahead matches, skipping disabled options and cycling single letters", () => {
        expect(findTypeahead(options, "c", 0)).toBe(2);
        expect(findTypeahead(options, "b", 0)).toBe(-1);
        expect(findTypeahead(options, "d", 3)).toBe(3);
        expect(findTypeahead(options, "ch", 0)).toBe(2);
        expect(findTypeahead(options, "", 0)).toBe(-1);
        const twins = [
            { value: "1", label: "Apple" },
            { value: "2", label: "Avocado" },
        ];
        expect(findTypeahead(twins, "a", 0)).toBe(1);
        expect(findTypeahead(twins, "a", 1)).toBe(0);
        expect(findTypeahead(twins, "aa", 0)).toBe(1);
    });

    it("filters options and groups, and matches accents, meta and keywords", () => {
        expect(matchesQuery({ value: "x", label: "Zürich" }, "zurich")).toBe(true);
        expect(matchesQuery({ value: "x", label: "X", meta: "UTC+2" }, "utc+2")).toBe(true);
        expect(matchesQuery({ value: "x", label: "X", keywords: ["swiss"] }, "SWISS")).toBe(true);
        expect(matchesQuery({ value: "x", label: "X" }, "y")).toBe(false);
        expect(filterItems(zones, "").length).toBe(2);
        expect(filterItems(zones, "lisbon")).toEqual([{ label: "Europe", options: [{ value: "lis", label: "Lisbon", meta: "UTC+0" }] }]);
        expect(filterItems(zones, "nothing")).toEqual([]);
    });
});

afterEach(() => {
    reducedMotion.value = true;
});
