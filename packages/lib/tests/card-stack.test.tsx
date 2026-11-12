import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CardStack, type CardStackProps } from "../src/components/display/card-stack/card-stack";
import { dragDecision } from "../src/components/display/card-stack/card-stack.utils";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const reducedMotion = vi.hoisted(() => ({ value: true }));
vi.mock("motion/react", async (importOriginal) => ({
    ...(await importOriginal<typeof import("motion/react")>()),
    useReducedMotion: () => reducedMotion.value,
}));

type City = { id: string; name: string };
const cities: City[] = ["Lisbon", "Copenhagen", "Porto", "Kyoto"].map((name) => ({ id: name.toLowerCase(), name }));

const setup = (props: Partial<CardStackProps<City>> = {}) => {
    const onDecide = vi.fn();
    const onUndo = vi.fn();
    const onReset = vi.fn();
    const user = userEvent.setup();
    const view = (nextProps: Partial<CardStackProps<City>> = props) => (
        <ComponentsProvider>
            <CardStack
                items={cities}
                getKey={(city) => city.id}
                getLabel={(city) => city.name}
                renderCard={(city) => <h3>{city.name}</h3>}
                onDecide={onDecide}
                onUndo={onUndo}
                onReset={onReset}
                {...nextProps}
            />
        </ComponentsProvider>
    );
    const utils = render(view());
    return {
        ...utils,
        user,
        onDecide,
        onUndo,
        onReset,
        rerenderWith: (next: Partial<CardStackProps<City>>) => utils.rerender(view({ ...props, ...next })),
    };
};

const stage = () => screen.getByRole("group", { name: "Cards" });
const topCard = (name: RegExp | string) => screen.getByRole("group", { name });
const press = (name: string) => screen.getByRole("button", { name });

beforeEach(() => {
    reducedMotion.value = true;
});

describe("CardStack structure", () => {
    it("is a focusable group described as a card stack, with a hint for the controls", () => {
        setup();
        expect(stage()).toHaveAttribute("aria-roledescription", "card stack");
        expect(stage()).toHaveAttribute("tabindex", "0");
        expect(stage()).toHaveAccessibleDescription(/left and right arrow keys/);
    });

    it("accepts a custom label", () => {
        setup({ label: "Destinations" });
        expect(screen.getByRole("group", { name: "Destinations" })).toBeInTheDocument();
    });

    it("exposes only the top card, labelled with its position", () => {
        const { container } = setup();
        expect(topCard("Lisbon, 1 of 4")).toBeInTheDocument();
        const hidden = container.querySelectorAll("[data-top='false']");
        expect(hidden).toHaveLength(3);
        for (const card of hidden) expect(card).toHaveAttribute("aria-hidden", "true");
    });

    it("renders at most four cards however long the deck is", () => {
        const many = Array.from({ length: 30 }, (_, index) => ({ id: `c${index}`, name: `City ${index}` }));
        const { container } = setup({ items: many });
        expect(container.querySelectorAll("[data-depth]")).toHaveLength(4);
        expect(topCard("City 0, 1 of 30")).toBeInTheDocument();
        expect(screen.queryByText("City 4")).not.toBeInTheDocument();
    });

    it("has no axe violations", async () => {
        const { container } = setup();
        expect((await axe(container)).violations).toHaveLength(0);
    });
});

describe("CardStack decisions", () => {
    it("decides the top card from the buttons and reveals the next one", async () => {
        const { user, onDecide } = setup();
        await user.click(press("Pass"));
        expect(onDecide).toHaveBeenCalledWith(cities[0], "left");
        await waitFor(() => expect(screen.queryByRole("group", { name: "Lisbon, 1 of 4" })).not.toBeInTheDocument());
        expect(topCard("Copenhagen, 2 of 4")).toBeInTheDocument();

        await user.click(press("Keep"));
        expect(onDecide).toHaveBeenLastCalledWith(cities[1], "right");
        await waitFor(() => expect(topCard("Porto, 3 of 4")).toBeInTheDocument());
    });

    it("decides with the arrow keys", async () => {
        const { user, onDecide } = setup();
        stage().focus();
        await user.keyboard("{ArrowLeft}");
        expect(onDecide).toHaveBeenLastCalledWith(cities[0], "left");
        await user.keyboard("{ArrowRight}");
        expect(onDecide).toHaveBeenLastCalledWith(cities[1], "right");
        expect(onDecide).toHaveBeenCalledTimes(2);
    });

    it("ignores the arrow keys while typing inside a card", async () => {
        const { user, onDecide } = setup({ renderCard: () => <input aria-label="Note" /> });
        await user.click(screen.getByRole("textbox", { name: "Note" }));
        await user.keyboard("{ArrowLeft}{Backspace}");
        expect(onDecide).not.toHaveBeenCalled();
    });

    it("uses custom labels on the buttons and the stamps", () => {
        const { container } = setup({ labels: { left: "Skip", right: "Shortlist" } });
        expect(press("Skip")).toBeInTheDocument();
        expect(press("Shortlist")).toBeInTheDocument();
        expect([...container.querySelectorAll(".__card-stack__stamp")].map((node) => node.textContent)).toEqual(["Skip", "Shortlist"]);
    });

    it("disables the decision buttons once the deck is empty", async () => {
        const { user } = setup({ items: cities.slice(0, 1) });
        await user.click(press("Keep"));
        expect(press("Pass")).toBeDisabled();
        expect(press("Keep")).toBeDisabled();
    });
});

describe("CardStack undo", () => {
    it("starts disabled and is named Undo even when icon-only", () => {
        setup();
        expect(press("Undo")).toBeDisabled();
    });

    it("returns the last card to the top and reports the decision it undoes", async () => {
        const { user, onUndo } = setup();
        await user.click(press("Keep"));
        await user.click(press("Pass"));
        await user.click(press("Undo"));
        expect(onUndo).toHaveBeenLastCalledWith(cities[1], "left");
        await waitFor(() => expect(topCard("Copenhagen, 2 of 4")).toBeInTheDocument());
        await user.click(press("Undo"));
        expect(onUndo).toHaveBeenLastCalledWith(cities[0], "right");
        await waitFor(() => expect(topCard("Lisbon, 1 of 4")).toBeInTheDocument());
        expect(press("Undo")).toBeDisabled();
    });

    it.each([["{Backspace}"], ["{Control>}z{/Control}"], ["{Meta>}z{/Meta}"]])("undoes with %s", async (keys) => {
        const { user, onUndo } = setup();
        stage().focus();
        await user.keyboard("{ArrowRight}");
        await user.keyboard(keys);
        expect(onUndo).toHaveBeenCalledWith(cities[0], "right");
    });

    it("does nothing from the keyboard when there is nothing to undo", async () => {
        const { user, onUndo } = setup();
        stage().focus();
        await user.keyboard("{Backspace}");
        expect(onUndo).not.toHaveBeenCalled();
    });
});

describe("CardStack completion", () => {
    const decideAll = async (user: ReturnType<typeof userEvent.setup>, count: number) => {
        for (let index = 0; index < count; index++) await user.click(press("Keep"));
    };

    it("offers a Start over button that brings every card back", async () => {
        const { user, onReset } = setup();
        await decideAll(user, 4);
        await user.click(await screen.findByRole("button", { name: "Start over" }));
        expect(onReset).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(topCard("Lisbon, 1 of 4")).toBeInTheDocument());
        expect(screen.queryByRole("button", { name: "Start over" })).not.toBeInTheDocument();
    });

    it("lets the caller render the empty state with the reset function", async () => {
        const { user } = setup({ renderEmpty: (reset) => <button onClick={reset}>All done, again?</button> });
        await decideAll(user, 4);
        await user.click(await screen.findByRole("button", { name: "All done, again?" }));
        await waitFor(() => expect(topCard("Lisbon, 1 of 4")).toBeInTheDocument());
    });

    it("keeps decisions when more items arrive, and continues the deck", async () => {
        const { user, rerenderWith } = setup({ items: cities.slice(0, 2) });
        await user.click(press("Keep"));
        rerenderWith({ items: cities });
        await waitFor(() => expect(screen.getByRole("group", { name: "Copenhagen, 2 of 4" })).toBeInTheDocument());
        await waitFor(() => expect(within(stage()).queryByText("Lisbon")).not.toBeInTheDocument());
    });
});

describe("CardStack announcements", () => {
    it("announces decisions with the outcome, undo and reset politely", async () => {
        const { user } = setup({ outcomes: { left: "skipped", right: "shortlisted" } });
        const status = screen.getByRole("status");
        expect(status).toHaveAttribute("aria-live", "polite");
        expect(status).toBeEmptyDOMElement();
        await user.click(press("Pass"));
        expect(status).toHaveTextContent("Lisbon: skipped");
        await user.click(press("Keep"));
        expect(status).toHaveTextContent("Copenhagen: shortlisted");
        await user.click(press("Undo"));
        expect(status).toHaveTextContent("Copenhagen returned to the stack");
    });

    it("falls back to the button labels when outcomes are not given", async () => {
        const { user } = setup();
        await user.click(press("Keep"));
        expect(screen.getByRole("status")).toHaveTextContent("Lisbon: Keep");
    });

    it("announces the reset", async () => {
        const { user } = setup({ items: cities.slice(0, 1) });
        await user.click(press("Keep"));
        await user.click(await screen.findByRole("button", { name: "Start over" }));
        expect(screen.getByRole("status")).toHaveTextContent("All cards are back in the stack");
    });

    it("lets every string be translated", () => {
        setup({ translations: { cardStackLabel: "Cartas", cardStackUndo: "Desfazer", cardStackPass: "Passar", cardStackKeep: "Manter" } });
        expect(screen.getByRole("group", { name: "Cartas" })).toBeInTheDocument();
        expect(press("Desfazer")).toBeInTheDocument();
        expect(press("Passar")).toBeInTheDocument();
        expect(press("Manter")).toBeInTheDocument();
    });
});

describe("dragDecision", () => {
    it("decides a far drag to the side it went", () => {
        expect(dragDecision({ offset: 120, velocity: 0, width: 320 })).toBe("right");
        expect(dragDecision({ offset: -120, velocity: 0, width: 320 })).toBe("left");
    });

    it("scales the distance with the card width, with a floor", () => {
        expect(dragDecision({ offset: 85, velocity: 0, width: 200 })).toBe("right");
        expect(dragDecision({ offset: 85, velocity: 0, width: 400 })).toBeNull();
        expect(dragDecision({ offset: 79, velocity: 0, width: 100 })).toBeNull();
    });

    it("decides a quick flick after a short move", () => {
        expect(dragDecision({ offset: 40, velocity: 900, width: 320 })).toBe("right");
        expect(dragDecision({ offset: -40, velocity: -900, width: 320 })).toBe("left");
    });

    it("snaps back for a slow short drag and for a flick that barely moved", () => {
        expect(dragDecision({ offset: 40, velocity: 100, width: 320 })).toBeNull();
        expect(dragDecision({ offset: 10, velocity: 2000, width: 320 })).toBeNull();
        expect(dragDecision({ offset: 0, velocity: 0, width: 320 })).toBeNull();
    });

    it("follows the offset over the velocity when they disagree", () => {
        expect(dragDecision({ offset: 150, velocity: -900, width: 320 })).toBe("right");
    });
});
