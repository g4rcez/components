"use client";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, isSsr } from "@g4rcez/components";

export const ToggleMode = () => {
    const [mode, setMode] = useState(isSsr() ? "dark" : document.documentElement.classList.contains("dark") ? "dark" : "light");

    const onClick = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        if (newMode === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    };

    return (
        <Button
            type="button"
            size="icon"
            theme="ghost-neutral"
            onClick={onClick}
            className="docs-icon-button"
            aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            aria-pressed={mode === "dark"}
        >
            {mode === "light" ? <MoonIcon className="size-5" aria-hidden="true" /> : <SunIcon className="size-5" aria-hidden="true" />}
        </Button>
    );
};
