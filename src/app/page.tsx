"use client";
import { z } from "zod";
import { Button } from "~/components/core/button";
import { Card } from "~/components/display/card";
import { Dropdown } from "~/components/floating/dropdown";
import { Autocomplete } from "~/components/form/autocomplete";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Select } from "~/components/form/select";
import { Switch } from "~/components/form/switch";
import { useForm } from "~/hooks/use-form";

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
        <div className="text-foreground bg-background w-full h-screen">
            <div className="p-32 mx-auto container text-center">
                <Card>
                    <h1 className="font-medium text-7xl leading-snug tracking-tight">Testing</h1>
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
            </div>
        </div>
    );
}
