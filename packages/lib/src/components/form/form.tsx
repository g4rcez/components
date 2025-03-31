"use client";
import React from "react";

export const Form = (props: React.ComponentProps<"form">) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.persist();
        e.preventDefault();
        props.onSubmit?.(e);
    };
    return <form {...props} onSubmit={onSubmit} />;
};
