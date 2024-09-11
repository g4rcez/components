"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";

export const ToggleMode = () => {
  const [mode, setMode] = useState("light");
  const onClick = () => {
    const newMode = mode === "light" ? "dark" : "light"
    setMode(newMode)
    if (newMode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }
  return (
    <button type="button" onClick={onClick}>
      {mode === "light" ? <MoonIcon/> : <SunIcon/>}
    </button>
  );
};
