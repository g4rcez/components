import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const reducedMotion = vi.hoisted(() => ({ value: false }));
vi.mock("motion/react", async (importOriginal) => ({
    ...(await importOriginal<typeof import("motion/react")>()),
    useReducedMotion: () => reducedMotion.value,
}));

import { Slider } from "../src/components/form/slider/slider";
import { keyDirection, nearestIndex, normalizeMarks, snapToMarks, toValues, valueToPercent } from "../src/components/form/slider/slider.utils";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderSlider = (ui: React.ReactElement) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

const sliders = () => screen.getAllByRole("slider") as HTMLInputElement[];

/** JSDOM has no layout: give the control a 700px box so 7px of detent equals 1 unit on a 0-100 scale. */
const sizeControl = (container: HTMLElement, width = 700) => {
    const control = container.querySelector<HTMLElement>(".__slider__control")!;
    control.getBoundingClientRect = () => ({ left: 0, right: width, width, top: 0, bottom: 20, height: 20, x: 0, y: 0, toJSON: () => ({}) });
    return control;
};

beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
});

describe("Slider backwards compatibility", () => {
    it("still renders one thumb per entry of an array value", () => {
        renderSlider(<Slider defaultValue={[50, 75]} min={1} max={100} />);
        const [low, high] = sliders();
        expect(sliders()).toHaveLength(2);
        expect(low).toHaveValue("50");
        expect(high).toHaveValue("75");
        expect(low).toHaveAttribute("min", "1");
        expect(low).toHaveAttribute("max", "100");
    });

    it("renders a thumb for a plain number and for no value at all", () => {
        const { unmount } = renderSlider(<Slider defaultValue={30} />);
        expect(sliders()).toHaveLength(1);
        expect(sliders()[0]).toHaveValue("30");
        unmount();
        renderSlider(<Slider min={10} max={20} />);
        expect(sliders()[0]).toHaveValue("10");
    });

    it("keeps the control and root classes, and forwards className to the control", () => {
        const { container } = renderSlider(<Slider defaultValue={[10]} className="mine" />);
        expect(container.querySelector(".__slider")).toBeInTheDocument();
        expect(container.querySelector(".__slider__control")).toHaveClass("mine");
        expect(container.querySelector(".__slider__track")).toBeInTheDocument();
        expect(container.querySelector(".__slider__indicator")).toBeInTheDocument();
    });

    it("stays controlled and reports Base UI details", () => {
        const onValueChange = vi.fn();
        const Controlled = () => {
            const [value, setValue] = useState<number[]>([20]);
            return (
                <Slider
                    value={value}
                    onValueChange={(next, details) => {
                        onValueChange(next, details.reason);
                        setValue(next as number[]);
                    }}
                />
            );
        };
        renderSlider(<Controlled />);
        fireEvent.keyDown(sliders()[0], { key: "ArrowRight" });
        expect(onValueChange).toHaveBeenCalledWith([21], "keyboard");
        expect(sliders()[0]).toHaveValue("21");
    });

    it("hands a caller ref to the root element", () => {
        const ref = { current: null as HTMLDivElement | null };
        renderSlider(<Slider defaultValue={[1]} ref={ref} />);
        expect(ref.current).toHaveClass("__slider");
    });
});

describe("Slider accessibility", () => {
    it("names the thumb with label, and numbers range thumbs", () => {
        const { unmount } = renderSlider(<Slider label="Volume" defaultValue={[40]} />);
        expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
        unmount();
        renderSlider(<Slider label="Price" defaultValue={[10, 90]} />);
        expect(screen.getByRole("slider", { name: "Price 1" })).toBeInTheDocument();
        expect(screen.getByRole("slider", { name: "Price 2" })).toBeInTheDocument();
    });

    it("formats aria-valuetext with formatValue", () => {
        renderSlider(<Slider label="Opacity" defaultValue={[50]} formatValue={(value) => `${value}%`} />);
        expect(screen.getByRole("slider", { name: "Opacity" })).toHaveAttribute("aria-valuetext", "50%");
    });

    it("hides icons, the value tag and mark labels from assistive technology", () => {
        const { container } = renderSlider(
            <Slider label="Zoom" defaultValue={[50]} tooltip startIcon={<i>-</i>} endIcon={<i>+</i>} marks={[{ value: 50, label: "Half" }]} />
        );
        for (const selector of [".__slider__icon", ".__slider__tag", ".__slider__marks"]) {
            for (const node of container.querySelectorAll(selector)) expect(node.closest("[aria-hidden='true']")).not.toBeNull();
        }
    });

    it("has no axe violations with a label, marks and icons", async () => {
        const { container } = renderSlider(
            <Slider label="Volume" defaultValue={[40]} marks={[0, { value: 50, label: "50" }, 100]} tooltip startIcon={<i>-</i>} endIcon={<i>+</i>} />
        );
        expect((await axe(container)).violations).toHaveLength(0);
    });
});

describe("Slider value tag", () => {
    it("renders a tag per thumb only when tooltip is on", () => {
        const { container, unmount } = renderSlider(<Slider defaultValue={[10, 90]} />);
        expect(container.querySelectorAll(".__slider__tag")).toHaveLength(0);
        unmount();
        const view = renderSlider(<Slider defaultValue={[10, 90]} tooltip />);
        const tags = view.container.querySelectorAll(".__slider__tag");
        expect([...tags].map((tag) => tag.textContent)).toEqual(["10", "90"]);
    });

    it("follows the value and uses formatValue", () => {
        const { container } = renderSlider(<Slider defaultValue={[10]} tooltip formatValue={(value) => `${value} kg`} />);
        expect(container.querySelector(".__slider__tag")).toHaveTextContent("10 kg");
        fireEvent.keyDown(sliders()[0], { key: "ArrowRight" });
        expect(container.querySelector(".__slider__tag")).toHaveTextContent("11 kg");
    });

    it("marks thumbs at the ends so they can follow the stretch", () => {
        const { container } = renderSlider(<Slider defaultValue={[0, 50, 100]} />);
        const edges = [...container.querySelectorAll(".__slider__thumb")].map((thumb) => thumb.getAttribute("data-edge"));
        expect(edges).toEqual(["min", null, "max"]);
    });
});

describe("Slider marks", () => {
    it("draws a tick per mark inside the range and positions it by percent", () => {
        const { container } = renderSlider(<Slider defaultValue={[10]} min={0} max={200} marks={[0, 50, 100, 200, 999, -5]} />);
        const ticks = [...container.querySelectorAll<HTMLElement>(".__slider__tick")];
        expect(ticks.map((tick) => tick.style.insetInlineStart)).toEqual(["0%", "25%", "50%", "100%"]);
    });

    it("activates the tick the value sits on", () => {
        const { container } = renderSlider(<Slider defaultValue={[50]} marks={[0, 50, 100]} />);
        const active = [...container.querySelectorAll(".__slider__tick")].map((tick) => tick.getAttribute("data-active"));
        expect(active).toEqual([null, "true", null]);
    });

    it("prints labelled marks and commits the value when one is clicked", () => {
        const onValueChange = vi.fn();
        const onValueCommitted = vi.fn();
        renderSlider(
            <Slider
                label="Speed"
                defaultValue={[10]}
                marks={[{ value: 0, label: "Slow" }, { value: 100, label: "Fast" }, 50]}
                onValueChange={onValueChange}
                onValueCommitted={onValueCommitted}
            />
        );
        expect(screen.queryByText("50")).not.toBeInTheDocument();
        fireEvent.click(screen.getByText("Fast"));
        expect(sliders()[0]).toHaveValue("100");
        expect(onValueChange).toHaveBeenCalledWith([100], expect.objectContaining({ reason: "none" }));
        expect(onValueCommitted).toHaveBeenCalledWith([100], expect.objectContaining({ reason: "none" }));
    });

    it("moves the nearest thumb of a range and keeps the range ordered", () => {
        const onValueChange = vi.fn();
        renderSlider(<Slider label="Range" defaultValue={[20, 80]} marks={[{ value: 90, label: "High" }]} onValueChange={onValueChange} />);
        fireEvent.click(screen.getByText("High"));
        expect(onValueChange.mock.calls[0][0]).toEqual([20, 90]);
        expect(sliders().map((input) => input.value)).toEqual(["20", "90"]);
    });

    it("ignores mark clicks when disabled", () => {
        const onValueChange = vi.fn();
        renderSlider(<Slider label="Speed" disabled defaultValue={[10]} marks={[{ value: 100, label: "Fast" }]} onValueChange={onValueChange} />);
        fireEvent.click(screen.getByText("Fast"));
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it("snaps a pressed track to a nearby mark, but not a far one", () => {
        const onValueChange = vi.fn();
        const { container } = renderSlider(<Slider label="Level" defaultValue={[0]} marks={[50]} onValueChange={onValueChange} />);
        const control = sizeControl(container);

        // 700px for 100 units: 7px is one unit. 5px past the mark is inside the detent, 56px is well outside.
        fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 350 + 5, clientY: 10 });
        expect(sliders()[0]).toHaveValue("50");
        fireEvent.pointerUp(window, { pointerId: 1 });

        fireEvent.pointerDown(control, { pointerId: 2, button: 0, pointerType: "mouse", clientX: 350 + 7 * 8, clientY: 10 });
        expect(Number(sliders()[0].value)).toBeGreaterThan(55);
        fireEvent.pointerUp(window, { pointerId: 2 });
    });

    it("does not snap keyboard steps", () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[49]} marks={[50]} />);
        sizeControl(container);
        fireEvent.keyDown(sliders()[0], { key: "ArrowLeft" });
        expect(sliders()[0]).toHaveValue("48");
    });

    it("vibrates once when a drag falls into a detent", () => {
        const vibrate = vi.fn();
        Object.defineProperty(navigator, "vibrate", { configurable: true, value: vibrate });
        const { container } = renderSlider(<Slider label="Level" defaultValue={[0]} marks={[50]} />);
        const control = sizeControl(container);
        fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 350 + 5, clientY: 10 });
        expect(vibrate).toHaveBeenCalledTimes(1);
        fireEvent.pointerUp(window, { pointerId: 1 });
        Reflect.deleteProperty(navigator, "vibrate");
    });
});

describe("Slider elastic stretch", () => {
    const root = (container: HTMLElement) => container.querySelector<HTMLElement>(".__slider")!;

    it("stretches the track past the right end while dragging and springs back on release", async () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[100]} />);
        const control = sizeControl(container);
        fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 690, clientY: 10 });
        fireEvent.pointerMove(window, { pointerId: 1, clientX: 900, clientY: 10 });

        await waitFor(() => expect(Number(root(container).style.getPropertyValue("--slider-scale-x"))).toBeGreaterThan(1));
        expect(root(container).style.getPropertyValue("--slider-origin")).toBe("left center");
        expect(parseFloat(root(container).style.getPropertyValue("--slider-shift-max"))).toBeGreaterThan(0);
        expect(parseFloat(root(container).style.getPropertyValue("--slider-shift-min"))).toBe(0);

        fireEvent.pointerUp(window, { pointerId: 1 });
        await waitFor(() => expect(Number(root(container).style.getPropertyValue("--slider-scale-x"))).toBeCloseTo(1, 2), { timeout: 3000 });
    });

    it("stretches toward the left end with the opposite origin", async () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[0]} />);
        const control = sizeControl(container);
        fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 5, clientY: 10 });
        fireEvent.pointerMove(window, { pointerId: 1, clientX: -200, clientY: 10 });
        await waitFor(() => expect(root(container).style.getPropertyValue("--slider-origin")).toBe("right center"));
        expect(parseFloat(root(container).style.getPropertyValue("--slider-shift-min"))).toBeLessThan(0);
        fireEvent.pointerUp(window, { pointerId: 1 });
    });

    it("never stretches beyond the cap, however far the pointer goes", async () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[100]} />);
        const control = sizeControl(container);
        fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 690, clientY: 10 });
        fireEvent.pointerMove(window, { pointerId: 1, clientX: 100000, clientY: 10 });
        await waitFor(() => expect(parseFloat(root(container).style.getPropertyValue("--slider-shift-max"))).toBeGreaterThan(30));
        expect(parseFloat(root(container).style.getPropertyValue("--slider-shift-max"))).toBeLessThanOrEqual(36);
        fireEvent.pointerUp(window, { pointerId: 1 });
    });

    it("does not stretch while the pointer stays inside the track", () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[50]} />);
        const control = sizeControl(container);
        fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 300, clientY: 10 });
        fireEvent.pointerMove(window, { pointerId: 1, clientX: 400, clientY: 10 });
        expect(root(container).style.getPropertyValue("--slider-scale-x")).toBe("");
        fireEvent.pointerUp(window, { pointerId: 1 });
    });

    it("can be turned off with elastic={false}", () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[100]} elastic={false} />);
        const control = sizeControl(container);
        fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 690, clientY: 10 });
        fireEvent.pointerMove(window, { pointerId: 1, clientX: 900, clientY: 10 });
        expect(root(container).style.getPropertyValue("--slider-scale-x")).toBe("");
        fireEvent.pointerUp(window, { pointerId: 1 });
    });

    it("is off for vertical sliders and when disabled", () => {
        for (const props of [{ orientation: "vertical" as const }, { disabled: true }]) {
            const { container, unmount } = renderSlider(<Slider label="Level" defaultValue={[100]} {...props} />);
            const control = sizeControl(container);
            fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 690, clientY: 10 });
            fireEvent.pointerMove(window, { pointerId: 1, clientX: 900, clientY: 10 });
            expect(root(container).style.getPropertyValue("--slider-scale-x")).toBe("");
            unmount();
        }
    });

    it("nudges the track when a key pushes against a limit, and not otherwise", () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[100]} />);
        fireEvent.keyDown(sliders()[0], { key: "ArrowLeft" });
        expect(sliders()[0]).toHaveValue("99");
        expect(root(container).style.getPropertyValue("--slider-shift-max")).toBe("");

        fireEvent.keyDown(sliders()[0], { key: "ArrowRight" });
        expect(sliders()[0]).toHaveValue("100");
        expect(root(container).style.getPropertyValue("--slider-shift-max")).toBe("");

        fireEvent.keyDown(sliders()[0], { key: "ArrowRight" });
        expect(parseFloat(root(container).style.getPropertyValue("--slider-shift-max"))).toBeGreaterThan(0);
    });

    it("nudges toward the left at the minimum", () => {
        const { container } = renderSlider(<Slider label="Level" defaultValue={[0]} />);
        fireEvent.keyDown(sliders()[0], { key: "Home" });
        expect(parseFloat(root(container).style.getPropertyValue("--slider-shift-min"))).toBeLessThan(0);
        expect(root(container).style.getPropertyValue("--slider-origin")).toBe("right center");
    });

    it("keeps a caller onKeyDown", () => {
        const onKeyDown = vi.fn();
        const { container } = renderSlider(<Slider label="Level" defaultValue={[10]} onKeyDown={onKeyDown} />);
        fireEvent.keyDown(container.querySelector(".__slider")!, { key: "a" });
        expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    describe("with reduced motion", () => {
        beforeEach(() => {
            reducedMotion.value = true;
        });
        afterEach(() => {
            reducedMotion.value = false;
        });

        it("skips the stretch entirely but keeps the value working", () => {
            const { container } = renderSlider(<Slider label="Level" defaultValue={[100]} />);
            const control = sizeControl(container);
            fireEvent.pointerDown(control, { pointerId: 1, button: 0, pointerType: "mouse", clientX: 690, clientY: 10 });
            fireEvent.pointerMove(window, { pointerId: 1, clientX: 900, clientY: 10 });
            expect(root(container).style.getPropertyValue("--slider-scale-x")).toBe("");
            fireEvent.pointerUp(window, { pointerId: 1 });
            const before = Number(sliders()[0].value);
            fireEvent.keyDown(sliders()[0], { key: "ArrowLeft" });
            expect(sliders()[0]).toHaveValue(String(before - 1));
        });
    });
});

describe("slider utils", () => {
    it("normalizes marks: bounds, duplicates, order and labels", () => {
        expect(normalizeMarks(undefined, 0, 10)).toEqual([]);
        expect(normalizeMarks([10, 0, 5, 5, { value: 5, label: "Mid" }, -1, 11, Number.NaN], 0, 10)).toEqual([
            { value: 0 },
            { value: 5, label: "Mid" },
            { value: 10 },
        ]);
    });

    it("snaps within the threshold to the closest mark only", () => {
        expect(snapToMarks(48, [50], 3)).toBe(50);
        expect(snapToMarks(46, [50], 3)).toBe(46);
        expect(snapToMarks(51, [50, 52], 2)).toBe(50);
        expect(snapToMarks(51.5, [50, 52], 2)).toBe(52);
        expect(snapToMarks(48, [50], 0)).toBe(48);
        expect(snapToMarks(48, [], 5)).toBe(48);
    });

    it("converts values, indexes and keys", () => {
        expect(toValues(3)).toEqual([3]);
        expect(toValues([1, 2])).toEqual([1, 2]);
        expect(valueToPercent(25, 0, 200)).toBe(12.5);
        expect(valueToPercent(5, 5, 5)).toBe(0);
        expect(nearestIndex([10, 90], 70)).toBe(1);
        expect(nearestIndex([10, 90], 20)).toBe(0);
        expect(["ArrowRight", "End", "PageUp", "ArrowUp"].map(keyDirection)).toEqual([1, 1, 1, 1]);
        expect(["ArrowLeft", "Home", "PageDown", "ArrowDown"].map(keyDirection)).toEqual([-1, -1, -1, -1]);
        expect(keyDirection("a")).toBe(0);
    });
});
