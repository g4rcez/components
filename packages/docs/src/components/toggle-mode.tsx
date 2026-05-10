"use client";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { isSsr } from "../../../lib/src";

export const ToggleMode = () => {
    const [mode, setMode] = useState(isSsr() ? "light" : document.documentElement.classList.contains("dark") ? "dark" : "light");

    const onClick = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        if (newMode === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-card-background/50 hover:text-foreground"
            aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            {mode === "light" ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
        </button>
    );
};
