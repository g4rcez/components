/** Colour mode for the docs: the `dark` class on <html>, remembered in localStorage, defaulting to the system preference. */
export const THEME_KEY = "docs-theme";

export type ThemeMode = "light" | "dark";

/**
 * Runs inline in <head> before first paint, so the page never flashes the wrong theme.
 * Kept as a string because it must not depend on the bundle.
 */
export const themeInit = `(function(){try{var s=localStorage.getItem("${THEME_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

const root = () => document.documentElement;

export const getMode = (): ThemeMode => (root().classList.contains("dark") ? "dark" : "light");

export const setMode = (mode: ThemeMode) => {
    root().classList.toggle("dark", mode === "dark");
    root().style.colorScheme = mode;
    try {
        window.localStorage.setItem(THEME_KEY, mode);
    } catch {
        /* storage can be blocked; the choice then lasts for the page only */
    }
};

const stored = () => {
    try {
        return window.localStorage.getItem(THEME_KEY) !== null;
    } catch {
        return false;
    }
};

/** Notifies on class changes, and on system changes while the person has not chosen a mode. */
export const subscribeMode = (onChange: () => void) => {
    const observer = new MutationObserver(onChange);
    observer.observe(root(), { attributes: true, attributeFilter: ["class"] });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
        if (stored()) return;
        root().classList.toggle("dark", media.matches);
        onChange();
    };
    media.addEventListener("change", onSystem);
    return () => {
        observer.disconnect();
        media.removeEventListener("change", onSystem);
    };
};
