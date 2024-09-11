"use client";
import { LocalStorage } from "storage-manager-js";
import { useReducer } from "use-typed-reducer";
import { isSsr } from "../../lib/fns";
export const getLabel = (col) => { var _a, _b; return (_b = (_a = col.headerLabel) !== null && _a !== void 0 ? _a : col.thead) !== null && _b !== void 0 ? _b : col.id; };
export const createOptionCols = (cols) => cols.map((opt) => {
    var _a, _b;
    return ({
        value: opt.id,
        label: ((_b = (_a = opt.thead) !== null && _a !== void 0 ? _a : opt.headerLabel) !== null && _b !== void 0 ? _b : opt.id),
    });
});
export var ColType;
(function (ColType) {
    ColType["Boolean"] = "boolean";
    ColType["Number"] = "number";
    ColType["Select"] = "select";
    ColType["Text"] = "text";
})(ColType || (ColType = {}));
export const valueFromType = (input) => (input.type === "number" ? input.valueAsNumber : input.value);
const cols = () => (id, thead, options) => (Object.assign(Object.assign({}, options), { id, thead }));
export const createColumns = (callback) => {
    let items = [];
    const add = (id, thead, options) => items.push(Object.assign(Object.assign({}, options), { id, thead }));
    const remove = (id) => (items = items.filter((x) => x.id !== id));
    callback({ add, remove });
    return items;
};
const noop = {};
export const useTablePreferences = (name, options = noop) => {
    const init = isSsr() ? null : LocalStorage.get(`@unamed/table-${name}`) || null;
    const [state, dispatch] = useReducer({
        name,
        groups: options.groups || (init === null || init === void 0 ? void 0 : init.groups) || [],
        sorters: options.sorters || (init === null || init === void 0 ? void 0 : init.sorters) || [],
        filters: options.filters || (init === null || init === void 0 ? void 0 : init.filters) || [],
        cols: options.cols || (init === null || init === void 0 ? void 0 : init.cols) || [],
    }, (get) => {
        const intercept = (partial) => {
            const prev = get.state();
            const result = Object.assign(Object.assign({}, prev), partial);
            if (!isSsr())
                LocalStorage.set(`@unamed/table-${prev.name}`, result);
            return result;
        };
        return {
            set: (getters) => intercept(getters),
        };
    });
    return Object.assign(Object.assign(Object.assign({}, state), dispatch), { name });
};
