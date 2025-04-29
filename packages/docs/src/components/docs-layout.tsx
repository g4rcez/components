"use client";
import { Fragment, PropsWithChildren } from "react";
import { type Label } from "../../../lib/src";

type Props = {
  title: Label;
  section: string;
  description: Label;
  className?: string;
};

export const DocsLayout = (props: PropsWithChildren<Props>) => {
  return (
    <div className="lg:px-10 px-4 py-8 w-full min-w-full">
      <header className="mb-6">
        <h2 className="font-semibold text-2xl">{props.title}</h2>
        <p>{props.description}</p>
      </header>
      <div className="flex w-full min-w-full flex-col gap-y-8 container mx-auto">
        {props.children}
      </div>
    </div>
  );
};
