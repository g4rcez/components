"use client";

import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { Autocomplete, Button, Checkbox, DatePicker, Input, MultiSelect, Select, Switch } from "@g4rcez/components";

const sizes = ["big", "default", "min", "small", "tiny"] as const;
const options = [
    { value: "one", label: "One" },
    { value: "two", label: "Two" },
];

export default function InputButtonFormPage() {
    return (
        <DocsLayout title="Input and Button Form" section="form" description="Pair inputs and buttons with matching sizes in centered flex layouts.">
            <ComponentDemo
                title="Aligned Sizes"
                description="Each form uses items-center and the same size for its Input and Button."
                code={`import { Button, Input } from "@g4rcez/components";

const sizes = ["big", "default", "min", "small", "tiny"] as const;

export function InputButtonForms() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {sizes.map((size) => (
        <form
          key={size}
          className="flex w-full max-w-xl items-center justify-center gap-3"
        >
          <span className="w-16 shrink-0 text-sm font-medium capitalize">
            {size}
          </span>
          <div className="min-w-0 flex-1">
            <Input
              name={\`query-\${size}\`}
              aria-label={\`\${size} search input\`}
              title={\`\${size} input\`}
              size={size}
              placeholder="Search records"
            />
          </div>
          <Button size={size} type="submit">Search</Button>
        </form>
      ))}
    </div>
  );
}`}
            >
                <div className="flex w-full flex-col items-center gap-4">
                    {sizes.map((size) => (
                        <form
                            key={size}
                            aria-label={`${size} input and button form`}
                            className="flex relative w-full max-w-xl items-end justify-center gap-3"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <span className="w-16 absolute top-0 right-0 shrink-0 text-sm font-medium capitalize text-muted-foreground">{size}</span>
                            <div className="min-w-0 flex-1">
                                <Input
                                    name={`query-${size}`}
                                    aria-label={`${size} search input`}
                                    title={`${size} input`}
                                    size={size}
                                    placeholder="Search records"
                                />
                            </div>
                            <Button size={size} type="submit">
                                Search
                            </Button>
                        </form>
                    ))}
                </div>
            </ComponentDemo>

            <ComponentDemo
                title="All Form Controls"
                description="Every form control uses the same size names. The rows stay centered while the field titles show the alignment point."
                code={`import {
  Autocomplete,
  Button,
  Checkbox,
  DatePicker,
  Input,
  MultiSelect,
  Select,
  Switch,
} from "@g4rcez/components";

const sizes = ["big", "default", "min", "small", "tiny"] as const;
const options = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
];

export function AllFormControls() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {sizes.map((size) => (
        <div
          key={size}
          className="flex w-full flex-wrap items-center justify-center gap-3"
        >
          <Input title={\`Input - \${size}\`} size={size} placeholder="Input" />
          <Autocomplete title={\`Autocomplete - \${size}\`} size={size} options={options} placeholder="Autocomplete" />
          <MultiSelect title={\`MultiSelect - \${size}\`} size={size} options={options} placeholder="MultiSelect" />
          <DatePicker title={\`DatePicker - \${size}\`} size={size} placeholder="DatePicker" />
          <Select title={\`Select - \${size}\`} size={size} options={options} placeholder="Select" />
          <Checkbox size={size}>Checkbox</Checkbox>
          <Switch size={size}>Switch</Switch>
          <Button size={size}>Button</Button>
        </div>
      ))}
    </div>
  );
}`}
            >
                <div className="flex w-full flex-col items-center gap-6">
                    {sizes.map((size) => (
                        <div key={size} className="flex w-full flex-wrap items-center justify-center gap-3">
                            <Input title={`Input - ${size}`} size={size} placeholder="Input" />
                            <Autocomplete title={`Autocomplete - ${size}`} size={size} options={options} placeholder="Autocomplete" />
                            <MultiSelect title={`MultiSelect - ${size}`} size={size} options={options} placeholder="MultiSelect" />
                            <DatePicker title={`DatePicker - ${size}`} size={size} placeholder="DatePicker" />
                            <Select title={`Select - ${size}`} size={size} options={options} placeholder="Select" />
                            <Checkbox size={size}>Checkbox</Checkbox>
                            <Switch size={size}>Switch</Switch>
                            <Button size={size}>Button</Button>
                        </div>
                    ))}
                </div>
            </ComponentDemo>
        </DocsLayout>
    );
}
