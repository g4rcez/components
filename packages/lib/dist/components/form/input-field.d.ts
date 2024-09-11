import React, { PropsWithChildren } from "react";
import { Label } from "../../types";
import { PolymorphicProps } from "../core/polymorph";
export type FeedbackProps = React.PropsWithChildren<Partial<{
    info: Label;
    title: Label;
    hideLeft?: boolean;
    className?: string;
    placeholder: string;
    reportStatus: boolean;
}>>;
export declare const InputFeedback: ({ reportStatus, hideLeft, className, info, children, title }: FeedbackProps) => import("react/jsx-runtime").JSX.Element;
export type InputFieldProps<T extends "input" | "select"> = PolymorphicProps<Partial<{
    info: Label;
    labelClassName: string;
    error: string;
    hideLeft: boolean;
    interactive: boolean;
    container: string;
    left: Label;
    feedback: Label;
    optionalText: string;
    right: Label;
    rightLabel: Label;
    id: string;
    name: string;
    placeholder: string;
}>, T>;
export declare const InputField: <T extends "input" | "select">({ optionalText: _optionalText, left, rightLabel, container, feedback, interactive, right, info, children, error, form, id, labelClassName, name, title, placeholder, hideLeft, required, }: PropsWithChildren<InputFieldProps<T>>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=input-field.d.ts.map