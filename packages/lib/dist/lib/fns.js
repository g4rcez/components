export const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
});
const travel = (path, regexp, obj) => path
    .split(regexp)
    .filter(Boolean)
    .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
const regexPaths = { basic: /[,[\]]+?/, extend: /[,[\].]+?/ };
export const path = (obj, path) => {
    const result = travel(path, regexPaths.basic, obj) || travel(path, regexPaths.extend, obj);
    return result === undefined || result === obj ? undefined : result;
};
export const isSsr = () => typeof window === "undefined";
export const safeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
