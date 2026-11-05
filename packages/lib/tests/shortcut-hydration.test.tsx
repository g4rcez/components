import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Shortcut } from "../src/components/display/shortcut/shortcut";

const linux = "Mozilla/5.0 (X11; Linux x86_64)";
const mac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";

describe("Shortcut hydration", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        document.body.replaceChildren();
    });

    it("hydrates a server-rendered Mod shortcut on macOS without a mismatch and then shows the Command icon", async () => {
        const userAgent = vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(linux);
        const container = document.body.appendChild(document.createElement("div"));
        container.innerHTML = renderToString(<Shortcut value="Mod+K" />);
        expect(container).toHaveTextContent("Ctrl+K");

        userAgent.mockReturnValue(mac);
        const onRecoverableError = vi.fn();
        await act(async () => {
            hydrateRoot(container, <Shortcut value="Mod+K" />, { onRecoverableError });
        });

        expect(onRecoverableError).not.toHaveBeenCalled();
        expect(container.querySelector('[aria-label="Command"]')).toBeInTheDocument();
    });
});
