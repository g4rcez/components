"use client";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { Button } from "@g4rcez/components";
import { getMode, setMode, subscribeMode, type ThemeMode } from "@/lib/theme";

const serverSnapshot = (): ThemeMode | null => null;

export const ToggleMode = () => {
    const mode = useSyncExternalStore<ThemeMode | null>(subscribeMode, getMode, serverSnapshot);

    // Before hydration the mode is not known on the server, so the label stays neutral until it is.
    const label = mode === null ? "Toggle color mode" : mode === "light" ? "Switch to dark mode" : "Switch to light mode";

    return (
        <Button
            type="button"
            size="icon"
            theme="ghost-neutral"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className="docs-icon-button"
            aria-label={label}
            aria-pressed={mode === null ? undefined : mode === "dark"}
        >
            {mode === "dark" ? <SunIcon className="size-5" aria-hidden="true" /> : <MoonIcon className="size-5" aria-hidden="true" />}
        </Button>
    );
};
