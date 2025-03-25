import React, { Dispatch, JSX, JSXElementConstructor, SetStateAction } from "react";

export type Label = React.ReactNode | React.ReactElement | JSX.Element;

export type Merge<T> = { [K in keyof T]: T[K] } & {};

export type Override<Source, New> = Omit<Source, keyof New> & New;

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type POJO = {};

export type ComponentLike = React.ElementType;

export type Any = Record<string, any>;
