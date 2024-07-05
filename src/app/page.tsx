import { Card } from "~/components/display/card";
import { Autocomplete } from "~/components/form/autocomplete";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Select } from "~/components/form/select";

const selectProps = {
    placeholder: "Haskell",
    options: [{ value: "Javascript" }, { value: "Kotlin" }, { value: "Typescript" }],
    required: true,
    name: "language",
    title: "Programming Language",
};

export default function Home() {
    return (
        <div className="text-foreground bg-background w-full h-screen">
            <div className="p-32 mx-auto container text-center">
                <Card>
                    <h1 className="font-medium text-9xl leading-snug tracking-tight">Testing</h1>
                    <Form>
                        <Input placeholder="Document" required name="name" mask="cpf" title="Document" />
                        <Select {...selectProps} />
                        <Autocomplete {...selectProps} />
                    </Form>
                </Card>
            </div>
        </div>
    );
}
