import React, { Dispatch, SetStateAction } from "react";

export type Label = React.ReactNode | React.ReactElement | string;

export type Merge<T> = { [K in keyof T]: T[K] } & {};

export type Override<Source, New> = Omit<Source, keyof New> & New;

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type POJO = {};
