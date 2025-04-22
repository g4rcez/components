const osx = /Mac|iPod|iPhone|iPad/;

export const isMac = () => osx.test(navigator.userAgent);

const parseCombination = (combination: string): string[] =>
    combination.split("+").map((k) => {
        const key = k.trim();
        if (key === "Mod") return isMac() ? "Meta" : "Control";
        if (key === "Hyper") return isMac() ? "Meta+Shift+Alt" : "Control+Shift+Alt";
        return key;
    });

type Handler = (e: KeyboardEvent) => void;

const combine = (keys: string[]) => keys.map((x) => x.trim()).join("+");

export class CombiKeys {
    public combinations: Array<{ key: string; fn: Handler }> = [];

    public add<S extends string>(combi: S, fn: Handler) {
        const key = combine(parseCombination(combi));
        if (this.combinations.find((x) => x.key === key)) return;
        this.combinations.push({ fn, key });
    }

    public register() {
        const controller = new AbortController();
        const handler = (event: KeyboardEvent) => {
            const element = event.target as HTMLElement;
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                const bypass = element.getAttribute("data-combikeysbypass");
                if (bypass !== "true") return;
            }
            const activeKeys = new Set<string>();
            if (event.metaKey) activeKeys.add("Meta");
            if (event.ctrlKey) activeKeys.add("Control");
            if (event.altKey) activeKeys.add("Alt");
            activeKeys.add(event.shiftKey ? event.key.toUpperCase() : event.key);
            const action = combine(Array.from(activeKeys));
            this.combinations.forEach((bind) => {
                if (bind.key === action) {
                    event.preventDefault();
                    return void bind.fn(event);
                }
            });
        };
        window.addEventListener("keydown", handler, { signal: controller.signal });
        return () => controller.abort();
    }
}
