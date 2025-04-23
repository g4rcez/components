export const osxRegex = /Mac|iPod|iPhone|iPad/;

export const isMac = () => osxRegex.test(navigator.userAgent);

const parseCombination = (combination: string): string[] =>
    combination.split("+").map((k) => {
        const key = k.trim();
        if (key === "Mod") return isMac() ? "Meta" : "Control";
        if (key === "Hyper") return isMac() ? "Meta+Shift+Alt" : "Control+Shift+Alt";
        return key;
    });

type Handler = (e: KeyboardEvent) => void;

const combine = (keys: string[]) => keys.map((x) => x.trim()).join("+");

type Combi = { key: string; fn: Handler };

export class CombiKeys<T extends Combi> {
    public combinations: Combi[] = [];

    public constructor(combi: T[] = []) {
        this.combinations = this.combinations.concat(combi);
        this.combinations.forEach((x) => {
            this.add(x.key, x.fn);
        })
    }

    public add<S extends string, H extends Handler>(combi: S, fn: H) {
        const key = combine(parseCombination(combi));
        if (this.combinations.find((x) => x.key === key)) return;
        this.combinations.push({ fn, key });
        return this;
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
            if (event.key.charCodeAt(0) > 127) {
                const char = event.code.replace(/^Digit/, "").replace(/^Key/, "");
                activeKeys.add(event.shiftKey ? char.toUpperCase() : char.toLowerCase());
            } else activeKeys.add(event.shiftKey ? event.key.toUpperCase() : event.key);
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
