import type { AllPaths } from "sidekicker";
export declare const uuid: () => string;
export declare const path: <T extends {}, K extends AllPaths<T>>(obj: T, path: K) => any;
export declare const isSsr: () => boolean;
export declare const safeRegex: (string: string) => string;
//# sourceMappingURL=fns.d.ts.map