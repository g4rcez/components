import type { AllPaths } from "sidekicker";

export const uuid = (): string =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        let r = (Math.random() * 16) | 0;
        let v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

const travel = (path: string, regexp: RegExp, obj: any) =>
    path
        .split(regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? (res as any)[key] : res), obj);

const regexPaths = { basic: /[,[\]]+?/, extend: /[,[\].]+?/ };

export const path = <T extends {}, K extends AllPaths<T>>(obj: T, path: K) => {
    const result = travel(path, regexPaths.basic, obj) || travel(path, regexPaths.extend, obj);
    return result === undefined || result === obj ? undefined : result;
};

export const isSsr = () => typeof window === "undefined";

export const safeRegex = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


export const splitInto = <T extends any>(array: T[], size: number) => {
  const newArray: T[][] = [];
  for (let i = 0; i < size; i++) {
    const init = i * size;
    const result = array.slice(init, init + size);
    if (result.length > 0) newArray.push(result);
  }
  return newArray;
};
