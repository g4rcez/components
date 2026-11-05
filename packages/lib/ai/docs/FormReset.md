---
title: formReset
description: Utility function that resets all inputs and selects in a form to their default values and clears their initialization state.
package: "@g4rcez/components"
export: "{ formReset }"
import: "import { formReset } from '@g4rcez/components'"
category: form
---

# formReset

Resets all inputs and selects in a form to their default values and clears their initialization state.

## Import

```tsx
import { formReset } from "@g4rcez/components";
```

## Signature

```ts
function formReset(form?: HTMLFormElement | null): void;
```

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `form` | `HTMLFormElement \| null \| undefined` | Form to reset. No-op if `null` or `undefined`. |

## How It Works

1. Iterates over all elements in `form.elements`.
2. For `<input>` elements: sets `input.value` to `input.defaultValue`.
3. For `<select>` elements: sets `select.value` to `""`.
4. On every processed field: sets `data-initialized="false"`. Components like `Input` and `Autocomplete` then treat the field as untouched and suppress validation messages.

## Examples

### Reset after successful submission

```tsx
import { useRef } from "react";
import { Form } from "@g4rcez/components/form";
import { Input } from "@g4rcez/components/input";
import { Button } from "@g4rcez/components/button";
import { formReset } from "@g4rcez/components";
function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const data = new FormData(e.currentTarget);
        await submitToServer(Object.fromEntries(data));
        formReset(formRef.current);
    };
    return (
        <Form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-base">
            {" "}
            <Input name="name" title="Name" required /> <Input name="email" type="email" title="Email" required />{" "}
            <Button theme="primary" type="submit">
                {" "}
                Send{" "}
            </Button>{" "}
        </Form>
    );
}
```

### Cancel button that resets the form

```tsx
function EditForm({ defaultValues }: { defaultValues: Record<string, string> }) {
    const formRef = useRef<HTMLFormElement>(null);
    return (
        <Form ref={formRef} onSubmit={handleSave} className="flex flex-col gap-base">
            {" "}
            <Input name="title" title="Title" defaultValue={defaultValues.title} />{" "}
            <Input name="description" title="Description" defaultValue={defaultValues.description} />{" "}
            <div className="flex gap-sm">
                {" "}
                <Button theme="primary" type="submit">
                    {" "}
                    Save{" "}
                </Button>{" "}
                <Button theme="ghost" type="button" onClick={() => formReset(formRef.current)}>
                    {" "}
                    Cancel{" "}
                </Button>{" "}
            </div>{" "}
        </Form>
    );
}
```

## Do

- Use `formReset`, not `form.reset`, when the form contains library components. It also resets the `data-initialized` flag that controls validation UI.
- Pass a valid `HTMLFormElement` ref.

## Don't

- Don't expect `formReset` to fire `onChange` events. It sets `value` directly in the DOM and dispatches no React synthetic events.
- Don't use `formReset` to reset one field. Use standard DOM methods or React state.
- Don't use `formReset` instead of React-controlled state in complex forms.

## Accessibility

No direct accessibility implications. After a reset, validation error messages disappear. `data-initialized="false"` keeps them hidden until the user interacts with each field.

## Data Attributes

- `data-initialized="false"` is set on every `INPUT` and `SELECT` element in the form. `InputField` reads it to decide whether to show validation feedback.

## Notes

- Call with `null` or `undefined` is safe. The function returns early without throwing.
- Only elements with `tagName === "INPUT"` or `tagName === "SELECT"` are processed. `<textarea>` elements are not reset.
- `formReset` is a plain function, not a React component or hook. It works on DOM references.
