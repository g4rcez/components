"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useState } from "react";
import { z } from "zod";
import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Input,
  OptionProps,
  Select,
  Switch,
  useForm,
  UseFormSubmitParams,
} from "../../../../../lib/src";

const languages: OptionProps[] = [
  { label: "Elixir", value: "ex" },
  { label: "Javascript", value: "js" },
  { label: "Kotlin", value: "kt" },
  { label: "Typescript", value: "typescript" },
] as const;

const schema = z.object({
  name: z.string().min(1),
  document: z.string().min(1),
  surname: z.string().min(1),
  main: z.enum(languages.map((x) => x.value) as any),
  secondary: z.enum(languages.map((x) => x.value) as any),
  agree: z.literal(true),
  boolean: z.literal(true),
});

type Data = z.infer<typeof schema>;

type Args = UseFormSubmitParams<Data>;

export default function FormPage() {
  const form = useForm(schema);
  const [state, setState] = useState({});

  const onSubmit = (args: Args) => {
    console.log(args);
    args.event.preventDefault();
    setState(args.data);
  };

  return (
    <DocsLayout
      title="useForm"
      section="form"
      description="Form elements are useful when you need to accept user data entries. This library provides a useForm hook that integrate with zod to create forms as fast as possibile."
    >
      <Card>
        <form onInvalid={form.onInvalid()} onSubmit={form.onSubmit(onSubmit)}>
          <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Input{...form.input("name", { title: "Name", placeholder: "Fulano" })}/>
            <Input{...form.input("surname", { title: "Surname", placeholder: "Silva", })}/>
            <Input{...form.input("document", { title: "Document - CPF", placeholder: "000.000.000-00", })} mask="cpf"/>
            <Select{...form.select("main", { title: "Language", placeholder: "Elixir", options: languages, })}/>
            <Autocomplete{...form.select("secondary", { title: "Second language", placeholder: "Typescript", options: languages, })}/>
            <Switch{...form.checkbox("agree")} container="md:col-span-2 lg:col-span-3">Accept the terms - Switch</Switch>
            <Checkbox{...form.checkbox("boolean")} container="md:col-span-2 lg:col-span-3">Accept the terms - Checkbox</Checkbox>
          </div>
          <Button type="submit" disabled={form.disabled}>
            Submit
          </Button>
        </form>
      </Card>
      <Card title="Debug" container="mt-6">
        <pre className="mt-10">
          <code>{JSON.stringify({ ...form, state }, null, 2)}</code>
        </pre>
      </Card>
    </DocsLayout>
  );
}
