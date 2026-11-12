import type { ReactNode } from "react";

export type MorphSelectOption = {
    value: string;
    label: string;
    icon?: ReactNode;
    /** Trailing text such as a UTC offset or a count. Searchable. */
    meta?: string;
    /** Extra search terms, e.g. synonyms. */
    keywords?: string[];
    disabled?: boolean;
};

export type MorphSelectGroup = {
    label: string;
    options: MorphSelectOption[];
};

export type MorphSelectItem = MorphSelectOption | MorphSelectGroup;

/** Lists longer than this turn search on when `searchable` is "auto". */
export const AUTO_SEARCH_THRESHOLD = 8;

/** How many options PageUp / PageDown move. */
export const PAGE_STEP = 8;

export const isGroup = (item: MorphSelectItem): item is MorphSelectGroup => "options" in item;

export const flattenItems = (items: readonly MorphSelectItem[]): MorphSelectOption[] =>
    items.flatMap((item) => (isGroup(item) ? item.options : [item]));

const normalize = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();

export const matchesQuery = (option: MorphSelectOption, query: string) => {
    const needle = normalize(query);
    if (!needle) return true;
    return [option.label, option.meta ?? "", ...(option.keywords ?? [])].some((field) => normalize(field).includes(needle));
};

/** Keeps the options that match, preserving groups and dropping the ones left empty. */
export const filterItems = (items: readonly MorphSelectItem[], query: string): MorphSelectItem[] => {
    if (!normalize(query)) return [...items];
    const result: MorphSelectItem[] = [];
    for (const item of items) {
        if (isGroup(item)) {
            const options = item.options.filter((option) => matchesQuery(option, query));
            if (options.length) result.push({ ...item, options });
        } else if (matchesQuery(item, query)) {
            result.push(item);
        }
    }
    return result;
};

export const firstEnabled = (options: readonly MorphSelectOption[]) => options.findIndex((option) => !option.disabled);

export const lastEnabled = (options: readonly MorphSelectOption[]) => {
    for (let index = options.length - 1; index >= 0; index--) if (!options[index].disabled) return index;
    return -1;
};

/** Moves `steps` enabled options from `from` without wrapping. Stays put when nothing further is enabled. */
export const moveEnabled = (options: readonly MorphSelectOption[], from: number, steps: number) => {
    if (!options.length) return -1;
    const direction = steps < 0 ? -1 : 1;
    let index = from;
    let remaining = Math.abs(steps);
    while (remaining > 0) {
        let probe = index + direction;
        while (probe >= 0 && probe < options.length && options[probe].disabled) probe += direction;
        if (probe < 0 || probe >= options.length) break;
        index = probe;
        remaining--;
    }
    return index;
};

/**
 * Type-ahead: the next enabled option whose label starts with the typed text.
 * A single character (or the same one repeated) cycles through the options that start with it.
 */
export const findTypeahead = (options: readonly MorphSelectOption[], typed: string, from: number) => {
    const text = normalize(typed);
    if (!text || !options.length) return -1;
    const repeated = text.length > 1 && [...text].every((char) => char === text[0]);
    const needle = repeated ? text[0] : text;
    const start = text.length === 1 || repeated ? from + 1 : Math.max(from, 0);
    for (let step = 0; step < options.length; step++) {
        const index = (((start + step) % options.length) + options.length) % options.length;
        const option = options[index];
        if (!option.disabled && normalize(option.label).startsWith(needle)) return index;
    }
    return -1;
};

export const isPrintable = (event: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }) =>
    event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
