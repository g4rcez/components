import { afterEach, describe, expect, it, vi } from "vitest";

import { CombiKeys } from "../src/lib/combi-keys";

const press = (init: KeyboardEventInit) => window.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }));

describe("CombiKeys shift modifier", () => {
    afterEach(() => vi.restoreAllMocks());

    it("runs a Hyper binding when Control, Shift and Alt are pressed on a non-Apple user agent", () => {
        vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (X11; Linux x86_64)");
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Hyper+k", fn }]).register();
        press({ key: "K", ctrlKey: true, shiftKey: true, altKey: true });
        expect(fn).toHaveBeenCalledTimes(1);
        stop();
    });

    it("runs a Shift+ binding when Shift is pressed", () => {
        const fn = vi.fn();
        const stop = new CombiKeys([{ key: "Shift+k", fn }]).register();
        press({ key: "K", shiftKey: true });
        expect(fn).toHaveBeenCalledTimes(1);
        stop();
    });
});
