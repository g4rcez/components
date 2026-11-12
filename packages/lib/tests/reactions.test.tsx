import { HeartIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";

import { Reactions, type Reaction, type ReactionOption } from "../src/components/display/reactions/reactions";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const options: ReactionOption[] = [
    { id: "up", label: "Thumbs up", icon: ThumbsUpIcon },
    { id: "heart", label: "Heart", icon: HeartIcon },
    { id: "party", label: "Party", icon: "🎉" },
    { id: "eyes", label: "Eyes", icon: <span data-testid="eyes-icon">👀</span> },
];

const initial: Reaction[] = [
    { id: "up", count: 4, reacted: false },
    { id: "heart", count: 1, reacted: true },
];

const setup = (props: Partial<React.ComponentProps<typeof Reactions>> = {}) => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const utils = render(
        <ComponentsProvider>
            <Reactions options={options} defaultValue={initial} onValueChange={onValueChange} {...props} />
        </ComponentsProvider>
    );
    return { ...utils, user, onValueChange };
};

const pill = (name: string | RegExp) => screen.getByRole("button", { name });
const addButton = () => screen.getByRole("button", { name: "Add reaction" });
/** Opens the picker and waits until floating-ui has moved focus onto its first option. */
const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(addButton());
    const toolbar = await screen.findByRole("toolbar", { name: "Choose a reaction" });
    await waitFor(() => expect(within(toolbar).getAllByRole("button")[0]).toHaveFocus());
    return toolbar;
};

describe("Reactions bar", () => {
    it("is a labelled group with a pill per reaction, in the order given", () => {
        setup();
        const group = screen.getByRole("group", { name: "Reactions" });
        const names = within(group)
            .getAllByRole("button")
            .map((button) => button.getAttribute("aria-label"));
        expect(names).toEqual(["Thumbs up, 4", "Heart, 1, you reacted", "Add reaction"]);
    });

    it("exposes the pressed state of the person's own reaction", () => {
        setup();
        expect(pill("Thumbs up, 4")).toHaveAttribute("aria-pressed", "false");
        expect(pill("Heart, 1, you reacted")).toHaveAttribute("aria-pressed", "true");
    });

    it("accepts a custom label", () => {
        setup({ label: "Comment reactions" });
        expect(screen.getByRole("group", { name: "Comment reactions" })).toBeInTheDocument();
    });

    it("hides pills with a zero count and reactions the options do not know", () => {
        setup({
            defaultValue: [
                { id: "up", count: 0, reacted: false },
                { id: "ghost", count: 9, reacted: false },
                { id: "heart", count: 2, reacted: false },
            ],
        });
        expect(screen.queryByRole("button", { name: /Thumbs up/ })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /ghost/ })).not.toBeInTheDocument();
        expect(pill("Heart, 2")).toBeInTheDocument();
    });

    it("renders icon components, elements and emoji", async () => {
        const { user } = setup({
            defaultValue: [
                { id: "up", count: 1, reacted: false },
                { id: "party", count: 1, reacted: false },
                { id: "eyes", count: 1, reacted: false },
            ],
        });
        expect(pill("Thumbs up, 1").querySelector("svg")).toBeInTheDocument();
        expect(pill("Party, 1")).toHaveTextContent("🎉");
        expect(screen.getByTestId("eyes-icon")).toBeInTheDocument();
        const toolbar = await openPicker(user);
        expect(within(toolbar).getAllByRole("button")).toHaveLength(4);
    });

    it("has no axe violations", async () => {
        const { container, user } = setup();
        expect((await axe(container)).violations).toHaveLength(0);
        await openPicker(user);
        // The floating-ui focus guards around the panel are not part of this component's markup, so audit the panel itself.
        expect((await axe(screen.getByRole("dialog"))).violations).toHaveLength(0);
    });
});

describe("Reactions toggling", () => {
    it("adds the person's reaction on press and removes it on the next", async () => {
        const { user, onValueChange } = setup();
        await user.click(pill("Thumbs up, 4"));
        expect(pill("Thumbs up, 5, you reacted")).toHaveAttribute("aria-pressed", "true");
        expect(onValueChange).toHaveBeenLastCalledWith(
            [
                { id: "up", count: 5, reacted: true },
                { id: "heart", count: 1, reacted: true },
            ],
            { id: "up", reacted: true }
        );

        await user.click(pill("Thumbs up, 5, you reacted"));
        expect(pill("Thumbs up, 4")).toHaveAttribute("aria-pressed", "false");
        expect(onValueChange).toHaveBeenLastCalledWith(expect.anything(), { id: "up", reacted: false });
    });

    it("works with the keyboard", async () => {
        const { user } = setup();
        pill("Thumbs up, 4").focus();
        await user.keyboard("{Enter}");
        expect(pill(/Thumbs up, 5/)).toBeInTheDocument();
        await user.keyboard(" ");
        expect(pill("Thumbs up, 4")).toBeInTheDocument();
    });

    it("keeps counts consistent through quick repeated taps", async () => {
        const { user, onValueChange } = setup();
        const button = pill("Thumbs up, 4");
        await user.click(button);
        await user.click(pill(/Thumbs up, 5/));
        await user.click(pill(/Thumbs up, 4/));
        expect(pill("Thumbs up, 5, you reacted")).toBeInTheDocument();
        expect(onValueChange.mock.calls.map(([, change]) => change.reacted)).toEqual([true, false, true]);
        expect(onValueChange.mock.calls.map(([next]) => next[0].count)).toEqual([5, 4, 5]);
    });

    it("removes the pill when the last reaction is taken back", async () => {
        const { user, onValueChange } = setup();
        await user.click(pill("Heart, 1, you reacted"));
        await waitFor(() => expect(screen.queryByRole("button", { name: /Heart/ })).not.toBeInTheDocument());
        expect(onValueChange).toHaveBeenLastCalledWith([{ id: "up", count: 4, reacted: false }], { id: "heart", reacted: false });
    });

    it("rolls the count: one accessible number per pill", async () => {
        const { user } = setup();
        await user.click(pill("Thumbs up, 4"));
        expect(within(pill(/Thumbs up, 5/)).getByText("5")).toBeInTheDocument();
    });
});

describe("Reactions picker", () => {
    it("opens from the add button and lists every option, marking the ones already used", async () => {
        const { user } = setup();
        const toolbar = await openPicker(user);
        expect(
            within(toolbar)
                .getAllByRole("button")
                .map((button) => button.getAttribute("aria-label"))
        ).toEqual(["Thumbs up", "Heart", "Party", "Eyes"]);
        expect(within(toolbar).getByRole("button", { name: "Heart" })).toHaveAttribute("aria-pressed", "true");
        expect(within(toolbar).getByRole("button", { name: "Party" })).toHaveAttribute("aria-pressed", "false");
    });

    it("adds a new pill at the end, closes, and returns focus to the add button", async () => {
        const { user, onValueChange } = setup();
        const toolbar = await openPicker(user);
        await user.click(within(toolbar).getByRole("button", { name: "Party" }));
        expect(pill("Party, 1, you reacted")).toBeInTheDocument();
        expect(onValueChange).toHaveBeenLastCalledWith(expect.arrayContaining([{ id: "party", count: 1, reacted: true }]), {
            id: "party",
            reacted: true,
        });
        expect(onValueChange.mock.calls[0][0].map((reaction: Reaction) => reaction.id)).toEqual(["up", "heart", "party"]);
        await waitFor(() => expect(screen.queryByRole("toolbar")).not.toBeInTheDocument());
        await waitFor(() => expect(addButton()).toHaveFocus());
    });

    it("toggles an existing reaction off from the picker", async () => {
        const { user } = setup();
        const toolbar = await openPicker(user);
        await user.click(within(toolbar).getByRole("button", { name: "Heart" }));
        await waitFor(() => expect(screen.queryByRole("button", { name: /Heart/ })).not.toBeInTheDocument());
    });

    it("moves between options with the arrow keys, wrapping at both ends", async () => {
        const { user } = setup();
        const toolbar = await openPicker(user);
        const buttons = within(toolbar).getAllByRole("button");

        await user.keyboard("{ArrowRight}");
        expect(buttons[1]).toHaveFocus();
        await user.keyboard("{ArrowLeft}{ArrowLeft}");
        expect(buttons[3]).toHaveFocus();
        await user.keyboard("{ArrowRight}");
        expect(buttons[0]).toHaveFocus();
        await user.keyboard("{End}");
        expect(buttons[3]).toHaveFocus();
        await user.keyboard("{Home}");
        expect(buttons[0]).toHaveFocus();
    });

    it("uses a roving tabindex: exactly one option is tabbable", async () => {
        const { user } = setup();
        const toolbar = await openPicker(user);
        const buttons = within(toolbar).getAllByRole("button");
        expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1);
        await user.keyboard("{ArrowRight}");
        expect(buttons.filter((button) => button.tabIndex === 0)).toEqual([buttons[1]]);
    });

    it("picks with Enter and Space", async () => {
        const { user } = setup();
        await openPicker(user);
        await user.keyboard("{ArrowRight}{ArrowRight}{Enter}");
        expect(pill("Party, 1, you reacted")).toBeInTheDocument();
    });

    it("closes with Escape and returns focus to the add button", async () => {
        const { user } = setup();
        await openPicker(user);
        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("toolbar")).not.toBeInTheDocument());
        await waitFor(() => expect(addButton()).toHaveFocus());
    });

    it("exposes the open state on the trigger", async () => {
        const { user } = setup();
        expect(addButton()).toHaveAttribute("aria-expanded", "false");
        await openPicker(user);
        expect(addButton()).toHaveAttribute("aria-expanded", "true");
    });
});

describe("Reactions controlled mode", () => {
    it("shows what the parent passes and only reports on press", async () => {
        const onValueChange = vi.fn();
        const user = userEvent.setup();
        const { rerender } = render(<Reactions options={options} value={initial} onValueChange={onValueChange} />);
        await user.click(pill("Thumbs up, 4"));
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(pill("Thumbs up, 4")).toBeInTheDocument();

        rerender(<Reactions options={options} value={[{ id: "up", count: 5, reacted: true }]} onValueChange={onValueChange} />);
        expect(pill("Thumbs up, 5, you reacted")).toBeInTheDocument();
    });

    it("supports server-backed counts: the parent persists and passes the next list back", async () => {
        const user = userEvent.setup();
        const Server = () => {
            const [value, setValue] = useState<Reaction[]>(initial);
            return <Reactions options={options} value={value} onValueChange={(next) => setValue(next)} />;
        };
        render(<Server />);
        await user.click(pill("Thumbs up, 4"));
        expect(pill("Thumbs up, 5, you reacted")).toBeInTheDocument();
    });
});

describe("Reactions focus and announcements", () => {
    it("moves focus to the next pill when the focused one leaves the bar", async () => {
        const { user } = setup({
            defaultValue: [
                { id: "up", count: 1, reacted: true },
                { id: "heart", count: 3, reacted: false },
            ],
        });
        pill("Thumbs up, 1, you reacted").focus();
        await user.keyboard("{Enter}");
        await waitFor(() => expect(pill("Heart, 3")).toHaveFocus());
    });

    it("moves focus to the previous pill when the last one leaves", async () => {
        const { user } = setup({
            defaultValue: [
                { id: "up", count: 3, reacted: false },
                { id: "heart", count: 1, reacted: true },
            ],
        });
        pill("Heart, 1, you reacted").focus();
        await user.keyboard("{Enter}");
        await waitFor(() => expect(pill("Thumbs up, 3")).toHaveFocus());
    });

    it("falls back to the add button when the only pill leaves", async () => {
        const { user } = setup({ defaultValue: [{ id: "heart", count: 1, reacted: true }] });
        pill("Heart, 1, you reacted").focus();
        await user.keyboard("{Enter}");
        await waitFor(() => expect(addButton()).toHaveFocus());
    });

    it("announces additions and removals politely", async () => {
        const { user } = setup();
        const status = screen.getByRole("status");
        expect(status).toBeEmptyDOMElement();
        expect(status).toHaveAttribute("aria-live", "polite");
        await user.click(pill("Thumbs up, 4"));
        expect(status).toHaveTextContent("Thumbs up added, 5 total");
        await user.click(pill(/Thumbs up, 5/));
        expect(status).toHaveTextContent("Thumbs up removed, 4 total");
    });

    it("lets every string be translated", () => {
        setup({ label: undefined, translations: { reactionsLabel: "Reações", reactionsAdd: "Adicionar reação" } });
        expect(screen.getByRole("group", { name: "Reações" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Adicionar reação" })).toBeInTheDocument();
    });
});
