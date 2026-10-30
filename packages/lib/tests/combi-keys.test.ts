import { afterEach, describe, expect, it, vi } from "vitest";

import { CombiKeys } from "../src/lib/combi-keys";

const press = (init: KeyboardEventInit, target: EventTarget = window) => {
    const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
};

describe("CombiKeys", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        vi.restoreAllMocks();
    });

    it("runs the handler and prevents default for a registered combination", () => {
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Control+k", fn }]).register();
        const event = press({ key: "k", ctrlKey: true });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(event.defaultPrevented).toBe(true);
        stop();
    });

    it("ignores combinations that were not registered", () => {
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Control+k", fn }]).register();
        const event = press({ key: "j", ctrlKey: true });
        expect(fn).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(false);
        stop();
    });

    it("stops listening after the returned cleanup runs", () => {
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Alt+x", fn }]).register();
        stop();
        press({ key: "x", altKey: true });
        expect(fn).not.toHaveBeenCalled();
    });

    it("keeps the first handler when the same combination is added twice", () => {
        const first = vi.fn();
        const second = vi.fn();
        const keys = new CombiKeys<{ key: string; fn: (e: KeyboardEvent) => void }>();
        keys.add("Alt+x", first);
        keys.add("Alt+x", second);
        const stop = keys.register();
        press({ key: "x", altKey: true });
        expect(first).toHaveBeenCalledTimes(1);
        expect(second).not.toHaveBeenCalled();
        stop();
    });

    it("uses uppercase letters when shift is pressed", () => {
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Control+K", fn }]).register();
        press({ key: "K", ctrlKey: true, shiftKey: true });
        expect(fn).toHaveBeenCalledTimes(1);
        stop();
    });

    it("ignores events from inputs unless data-combikeysbypass is true", () => {
        const fn = vi.fn();
        const plain = document.createElement("input");
        const bypass = document.createElement("input");
        bypass.setAttribute("data-combikeysbypass", "true");
        document.body.append(plain, bypass);
        const stop = new CombiKeys([{ key: "Control+k", fn }]).register();
        press({ key: "k", ctrlKey: true }, plain);
        expect(fn).not.toHaveBeenCalled();
        press({ key: "k", ctrlKey: true }, bypass);
        expect(fn).toHaveBeenCalledTimes(1);
        stop();
    });

    it("maps Mod to Control on non-Apple user agents", () => {
        vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (X11; Linux x86_64)");
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Mod+s", fn }]).register();
        press({ key: "s", ctrlKey: true });
        expect(fn).toHaveBeenCalledTimes(1);
        stop();
    });

    it("maps Mod to Meta on Apple user agents", () => {
        vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (Macintosh; Intel Mac OS X)");
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Mod+s", fn }]).register();
        press({ key: "s", metaKey: true });
        expect(fn).toHaveBeenCalledTimes(1);
        stop();
    });
});
