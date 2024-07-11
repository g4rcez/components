"use client";
import { InfoIcon } from "lucide-react";
import { z } from "zod";
import { Autocomplete, Button, Card, Dropdown, FileUpload, Form, Input, Select, Switch, Tooltip, useForm } from "../src";
import { ClientTable } from "./client-table";

const selectProps = {
    placeholder: "Haskell",
    options: [{ value: "Javascript" }, { value: "Kotlin" }, { value: "Typescript" }],
    required: true,
    name: "language",
    title: "Programming Language",
};

const schema = z.object({
    name: z.string(),
    lang: z.array(z.string()),
});

export default function Home() {
    const form = useForm(schema);
    return (
        <div className="w-full h-full">
            <div className="p-8 mx-auto container text-center flex flex-col gap-6">
                <Card>
                    <h1 className="font-medium gap-1 flex items-center justify-center text-7xl leading-snug tracking-tight">
                        Testing
                        <Tooltip title={<InfoIcon size={32} />}>I'm a tooltip</Tooltip>
                    </h1>
                    <Dropdown trigger="Floating form">
                        <Autocomplete {...selectProps} name="test" />
                        <Autocomplete {...selectProps} name="test2" />
                        <Select {...selectProps} name="test3" />
                        <Input {...selectProps} name="test4" />
                    </Dropdown>
                    <Form
                        className="space-y-4"
                        onSubmit={form.onSubmit((e) => {
                            console.log(e);
                        })}
                    >
                        <Input
                            {...form.input("name", {
                                placeholder: "Document",
                                required: true,
                                name: "name",
                                mask: "cpf",
                                title: "Document",
                            })}
                        />
                        <Select {...form.input("lang[0]", selectProps)} />
                        <Autocomplete {...form.input("lang[1]", selectProps)} />
                        <Switch>Enable preferences</Switch>
                        <div className="flex gap-4 justify-center">
                            <Button type="reset" disabled>
                                Disabled
                            </Button>
                            <Button type="reset" loading>
                                Loading
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </Form>
                </Card>
                <ClientTable />
                <Card>
                    <FileUpload id="id" />
                </Card>
            </div>
        </div>
    );
}
