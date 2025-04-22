import React, { Dispatch, JSX, ReactNode, SetStateAction } from "react";

export type Label = React.ReactNode | React.ReactElement | JSX.Element;

export type Merge<T> = { [K in keyof T]: T[K] } & {};

export type Override<Source, New> = Omit<Source, keyof New> & New;

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type POJO = object;

export type ComponentLike = React.ElementType;

export type Any = Record<string, any>;

export type Never = Record<string, never>;

export type Nil<T> = T | null | undefined;

export interface ReactComponent<P = Any> {
    propTypes?: any;
    displayName?: string | undefined;

    (props: P): ReactNode | Promise<ReactNode>;
}

export type CvaVariants<T extends object> = {
    [K in keyof T]?: keyof T[K];
};

type Irreducible = string | number | null | undefined | Date | symbol;

export type Walk<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends any[]
              ? K
              : K extends Irreducible
                ? T[K] extends object
                    ? K | T[K] extends Date
                        ? K
                        : `${K & string}.${Walk<T[K]> & string}`
                    : K
                : never;
      }[keyof T]
    : never;
