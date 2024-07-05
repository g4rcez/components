import React from "react";

export type Label = React.ReactNode | React.ReactElement | string;

export type Merge<T> = { [K in keyof T]: T[K] } & {};

export type Override<Source, New> = Omit<Source, keyof New> & New;
