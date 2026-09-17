// Warnings for problems no node can carry: an alias that resolves to
// nothing, a theme that cannot be found. Silence is the worst failure
// mode for an enforcement tool, so they go to stderr once per subject.

const seen = new Set<string>();
let sink: (message: string) => void = (message) => console.warn(message);

export function warnOnce(key: string, message: string) {
    if (seen.has(key)) return;
    seen.add(key);
    sink(`[@shadcn/lint] ${message}`);
}

export function setWarningSink(fn: (message: string) => void) {
    sink = fn;
}

export function resetWarnings() {
    seen.clear();
}
