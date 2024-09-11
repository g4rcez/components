import { ClassValue } from "clsx";
import React, { LegacyRef, MutableRefObject, RefCallback } from "react";
export declare const mergeRefs: <T extends unknown = any>(...refs: Array<MutableRefObject<T> | LegacyRef<T> | undefined | null>) => RefCallback<T>;
export declare const isReactComponent: (a: any) => a is React.ReactElement;
export declare const isReactFC: (a: any) => a is (...any: any[]) => any;
export declare const css: (...styles: ClassValue[]) => string;
export declare const dispatchInput: (node: HTMLInputElement | undefined | null, value: string) => Event | undefined;
//# sourceMappingURL=dom.d.ts.map