"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { FormEvent, useState } from "react";
import { z } from "zod";
import {
  Autocomplete,
  AutocompleteItemProps,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Input,
  MultiSelect,
  Select,
  Switch,
  useForm,
  UseOnSubmitArgs,
} from "../../../../../lib/src";

const languages: AutocompleteItemProps[] = [
  { label: "Elixir", value: "ex", Render: () => <span>💧 Elixir</span> },
  { label: "Javascript", value: "js" },
  { label: "Kotlin", value: "kt" },
  { label: "Typescript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "Cobol", value: "cobol" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "F#", value: "fsharp" },
] as const;

const clamp = (min: number, x: number, max: number) =>
  Math.min(Math.max(x, min), max);

const oabMask = (str: string) => {
  const numbers = str.replace(/[^0-9]/g, "");
  const len = clamp(4, numbers.length, 6);
  if (numbers.length === 6)
    return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "/", /[A-Za-z]/, /[A-Za-z]/];
  return Array.from({ length: len })
    .map((): string | RegExp => /\d/)
    .concat(["/", /[A-Za-z]/, /[A-Za-z]/]);
};

const schema = z.object({
  agree: z.literal(true),
  number: z.number(),
  boolean: z.literal(true),
  languages: z.array(z.string()),
  date: z.string().datetime(),
  name: z.string().min(1),
  document: z.string().min(1),
  surname: z.string().min(1),
  main: z.enum(languages.map((x) => x.value) as any),
  secondary: z.enum(languages.map((x) => x.value) as any),
  items: z.array(
    z.object({ document: z.string().min(1), name: z.string().min(1) }),
  ),
  oab: z.array(
    z.object({
      document: z
        .string()
        .regex(/[[0-9]{4,6}\/[A-Z]/, "Invalid OAB document")
        .transform((x) => x.toUpperCase()),
    }),
    { message: "At least one OAB" },
  ),
});

type Data = z.infer<typeof schema>;

type Args = UseOnSubmitArgs<Data>;

export default function FormPage() {
  const form = useForm(schema, "form");
  const [state, setState] = useState({});
  const [items, setItems] = useState<number[]>([0]);

  const onSubmit = (event: FormEvent<HTMLFormElement>, args: Args) => {
    console.log(args);
    event.preventDefault();
    setState(args.data);
  };

  return (
    <DocsLayout
      title="useForm"
      section="form"
      description="Form elements are useful when you need to accept user data entries. This library provides a useForm hook that integrate with zod to create forms as fast as possibile."
    >
      <Card>
        <form
          name="form"
          id="form"
          onSubmit={form.onSubmit(onSubmit)}
          onInvalid={form.onInvalid((e) => console.log(e))}
        />
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
          <Input
            {...form.input("name", { title: "Name", placeholder: "Fulano" })}
          />
          <Input
            {...form.input("number", {
              title: "Number",
              placeholder: "000",
            })}
          />
          <Input
            {...form.input("surname", {
              title: "Surname",
              placeholder: "Silva",
            })}
          />
          <Input
            {...form.input("document", {
              title: "Document - CPF",
              placeholder: "000.000.000-00",
            })}
            mask="cpf"
          />
          <Select
            {...form.select("main", {
              title: "Language",
              placeholder: "Select a language",
              options: languages,
            })}
          />
          <MultiSelect
            {...form.multiselect("languages", {
              title: "All language",
              options: languages,
              placeholder: "Select your languages",
            })}
          />
          <Autocomplete
            {...form.select("secondary", {
              title: "Second language",
              placeholder: "Select a language",
              onChange: (e: any) => console.log("CUSTOM", e.target.value),
              options: languages,
            })}
          />
          <DatePicker
            {...form.datepicker("date", {
              title: "Date",
              placeholder: "31/12/2077",
            })}
          />
          <Switch
            {...form.checkbox("agree")}
            container="md:col-span-2 lg:col-span-3"
          >
            Accept the terms - Switch
          </Switch>
          <Checkbox
            {...form.checkbox("boolean")}
            container="md:col-span-2 lg:col-span-3"
          >
            Accept the terms - Checkbox
          </Checkbox>
        </div>
        <ul className="my-4 space-y-4">
          {items.map((item) => (
            <li
              key={item}
              className="flex align-baseline items-baseline flex-nowrap gap-8"
            >
              <Input
                {...form.input(`items[${item}].name`)}
                title={`Name - ${item}`}
              />
              <Input
                {...form.input(`items[${item}].document`, { mask: "cpf" })}
                title={`Documento - ${item}`}
              />
              <Input
                {...form.input(`oab[${item}].document`, { mask: oabMask })}
                title={`Oab - ${item}`}
              />
            </li>
          ))}
          <li>
            <Button
              onClick={() => setItems((prev) => prev.concat(prev.at(-1)! + 1))}
            >
              Add other item
            </Button>
          </li>
        </ul>
        <Button form={form.name} type="submit">
          Submit
        </Button>
      </Card>
      <Card title={`Debug - User: ${form.get("name")}`} container="mt-6">
        <pre className="mt-10">
          <code>{JSON.stringify({ ...form, state }, null, 2)}</code>
        </pre>
      </Card>
    </DocsLayout>
  );
}
