import { useContext } from "react";
import { Context } from "../config/context";
import { defaultTweaks, type Tweaks } from "../config/default-tweaks";

export const useTweaks = (): Tweaks => useContext(Context)?.tweaks ?? defaultTweaks;

export const useTableTweaks = () => useTweaks().table;
