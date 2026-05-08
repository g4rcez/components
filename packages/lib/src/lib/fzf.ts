import { Is } from "sidekicker";
import { Any, Walk } from "../types";

export const fuzzyMatch = (text: string, search: string): number | null => {
    text = String(text).toLocaleLowerCase();
    search = String(search).toLocaleLowerCase();
    if (text === search) return 1;
    const firstChar = search[0];
    if (!firstChar) return null;

    const matchedIndexes: number[][] = [];
    let cursor = 0;
    while (cursor < text.length) {
        const startIdx = text.indexOf(firstChar, cursor);
        if (startIdx === -1) break;
        let pos = startIdx + 1;
        const indexes = [startIdx];
        let matched = true;
        for (let i = 1; i < search.length; i++) {
            const foundAt = text.indexOf(search[i]!, pos);
            if (foundAt === -1) {
                matched = false;
                break;
            }
            indexes.push(foundAt);
            pos = foundAt + 1;
        }
        if (matched) matchedIndexes.push(indexes);
        cursor = startIdx + 1;
    }

    if (matchedIndexes.length === 0) return null;
    const bestMatch = matchedIndexes.sort((a, b) => {
        if (a.length === 1) return a[0]! - b[0]!;
        return a[a.length - 1]! - a[0]! - (b[b.length - 1]! - b[0]!);
    })[0]!;
    if (bestMatch.length > 1) return 2 + (bestMatch[bestMatch.length - 1]! - bestMatch[0]!);
    return 2 + bestMatch[0]!;
};

export type Match = "EQUAL" | "CONTAINS" | "CONTAINS_NUMBERS" | "STARTS_WITH" | "ENDS_WITH" | "FUZZY";

export type MatchValue<T> = {
    match?: Match;
    score?: number;
    key: Walk<T>;
    value: string | string[];
    ifNotMatch?: (value: string, source: string) => boolean;
};

export type Matcher<T> = { match?: Match; key: Walk<T> };

const travel = (path: string, regexp: RegExp, obj: unknown): unknown => {
    const keys = path.split(regexp).filter(Boolean);
    let res: unknown = obj;
    for (const key of keys) {
        if (res === null || res === undefined) {
            return res;
        }
        res = (res as Record<string, unknown>)[key]; // key traversal — res is an object at this point due to null/undefined guard above
    }
    return res;
};

const regexPaths = { basic: /[,[\]]+?/, extend: /[,[\].]+?/ };

const path = <T extends Any, V>(obj: T, path: Walk<T>): V => {
    const result = travel(path as string, regexPaths.basic, obj);
    // travel returns unknown; V is the expected value type at a given path — caller is responsible for matching
    if (result !== undefined && result !== obj) return result as unknown as V;
    return travel(path as string, regexPaths.extend, obj) as unknown as V;
};

const onlyNumbers = (str: string) => str.replace(/[^0-9]/g, "");

const diacritics = (input: string): string => input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const strCompare = (text: string, value: string, _?: number, match: Match = "FUZZY"): boolean => {
    if (match === "CONTAINS") {
        return text.includes(value);
    }
    if (match === "EQUAL") {
        return text === value;
    }
    if (match === "CONTAINS_NUMBERS") {
        return onlyNumbers(text).includes(onlyNumbers(value));
    }
    if (match === "STARTS_WITH") {
        return text.startsWith(value);
    }
    if (match === "ENDS_WITH") {
        return text.endsWith(value);
    }
    if (match === "FUZZY") {
        const r = fuzzyMatch(text, value);
        return r !== null;
    }
    return false;
};

const compare = (search: string, value: string | string[], defaultScore?: number, match: Match = "FUZZY"): boolean =>
    Array.isArray(value) ? value.some((x) => strCompare(search, x, defaultScore, match)) : strCompare(search, value, defaultScore, match);

export const fzf = <T extends Any, ID extends Walk<T>>(items: T[], id: ID, keys: MatchValue<T>[]) => {
    if (keys.length === 0) {
        return items;
    }
    const map = new Map<ID, T>();
    const remap = keys.map((x) => {
        const target = Is.array(x.value)
            ? x.value.map((v) => diacritics(`${v}`.toLocaleLowerCase()).trim())
            : diacritics(`${x.value}`.toLocaleLowerCase()).trim();
        return { ...x, target };
    });
    items.forEach((item) => {
        const idVal = path<T, ID>(item, id);
        remap.forEach((filter) => {
            const searchValue = path(item, filter.key);
            if (!searchValue) return;
            const search = diacritics(`${searchValue}`.toLocaleLowerCase()).trim();
            if (compare(search, filter.target, filter.score, filter.match)) {
                return void map.set(idVal, item);
            }
            if (Is.function(filter.ifNotMatch)) {
                const result = filter.ifNotMatch(filter.target as string, search);
                if (result) map.set(idVal, item);
            }
        });
    });
    return Array.from(map.values());
};
