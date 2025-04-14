import type { AllPaths } from "sidekicker";
import { Any } from "../types";

const toHex = (n: number, length: number = 2) => n.toString(16).padStart(length, "0");

export const uuid = (): string => {
    const now = Date.now();
    const timeHigh = ((now / 1000) & 0x0fff) | 0x7000;
    const timeLow = now % 1000;
    const randomBytes = new Uint8Array(10);
    for (let i = 0; i < randomBytes.length; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
    }
    randomBytes[0] = (randomBytes[0] & 0x3f) | 0x80;
    return `${toHex(timeHigh, 4) + toHex(timeLow, 3)}-${toHex(randomBytes[0]) + toHex(randomBytes[1])}-${toHex(randomBytes[2]) + toHex(randomBytes[3])}-${toHex(randomBytes[4]) + toHex(randomBytes[5])}-${toHex(randomBytes[6]) + toHex(randomBytes[7]) + toHex(randomBytes[8]) + toHex(randomBytes[9])}`;
};

const travel = (path: string, regexp: RegExp, obj: Any) =>
    path
        .split(regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? (res as any)[key] : res), obj);

const regexPaths = { basic: /[,[\]]+?/, extend: /[,[\].]+?/ };

export const path = <T extends Any, K extends AllPaths<T>>(obj: T, path: K) => {
    const result = travel(path, regexPaths.basic, obj) || travel(path, regexPaths.extend, obj);
    return result === undefined || result === obj ? undefined : result;
};

export const isSsr = () => typeof window === "undefined";

export const safeRegex = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const splitInto = <T>(array: T[], size: number) => {
    const newArray: T[][] = [];
    for (let i = 0; i < size; i++) {
        const init = i * size;
        const result = array.slice(init, init + size);
        if (result.length > 0) newArray.push(result);
    }
    return newArray;
};

export const negate = (b: boolean) => !b;

export const noop = () => {};

export const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent);
}
