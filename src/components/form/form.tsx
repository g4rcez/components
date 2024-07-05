"use client";
import React from "react";

const inputFields = ["INPUT", "SELECT"];

export const formReset = (form?: HTMLFormElement | null) => {
  if (!form) return;
  const elements = Array.from(form.elements);
  elements.forEach((field) => {
    if (!inputFields.includes(field.tagName)) return;
    if (field.tagName === "INPUT") {
      (field as HTMLInputElement).value = (field as HTMLInputElement).defaultValue;
    }
    if (field.tagName === "SELECT") {
      (field as HTMLSelectElement).value = "";
    }
    field.setAttribute("data-initialized", "false");
  });
};

export const Form = (props: React.ComponentProps<"form">) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.persist();
    e.preventDefault();
    props.onSubmit?.(e);
  };
  return <form {...props} onSubmit={onSubmit}/>;
};