import type { AllPaths } from "sidekicker";
import type { Any } from "../types";

export const uuid = (): string => {
    const timestamp = Date.now();
    const bytes = new Uint8Array(16);
    bytes[0] = (timestamp / 2 ** 40) & 0xff;
    bytes[1] = (timestamp / 2 ** 32) & 0xff;
    bytes[2] = (timestamp / 2 ** 24) & 0xff;
    bytes[3] = (timestamp / 2 ** 16) & 0xff;
    bytes[4] = (timestamp / 2 ** 8) & 0xff;
    bytes[5] = timestamp & 0xff;
    const randomBytes = new Uint8Array(10);
    crypto.getRandomValues(randomBytes);
    bytes.set(randomBytes, 6);
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const travel = (path: string, regexp: RegExp, obj: Any) =>
    path
        .split(regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);

const regexPaths = { basic: /[,[\]]+?/, extend: /[,[\].]+?/ };

export const path = <T extends Any, K extends AllPaths<T>>(obj: T, path: K) => {
    const result = travel(path, regexPaths.basic, obj);
    const extendedResult = result === undefined ? travel(path, regexPaths.extend, obj) : result;
    return extendedResult === undefined || extendedResult === obj ? undefined : extendedResult;
};

export const isSsr = () => typeof window === "undefined";

export const safeRegex = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const splitInto = <T>(array: T[], size: number) => {
    if (!Number.isInteger(size) || size <= 0) return [];
    const newArray: T[][] = [];
    for (let index = 0; index < array.length; index += size) {
        newArray.push(array.slice(index, index + size));
    }
    return newArray;
};

export const negate = (b: boolean) => !b;

export const noop = () => {};

export const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera;
    return /android|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent ?? "");
};
