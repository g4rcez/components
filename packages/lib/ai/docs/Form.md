---
title: Form
description: Thin wrapper around the HTML form element that calls preventDefault automatically before invoking onSubmit.
package: "@g4rcez/components"
export: "{ Form }"
import: "import { Form } from '@g4rcez/components/form'"
category: form
---
# Form

Thin wrapper around the HTML `<form>` element that calls `preventDefault` automatically before invoking `onSubmit`.

## Import

```tsx
import { Form } from "@g4rcez/components/form";
```

## Props

`Form` accepts all standard HTML `<form>` attributes.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSubmit` | `(event: React.FormEvent<HTMLFormElement>) => void` | - | Submit handler. `preventDefault` runs first. |
| `children` | `React.ReactNode` | - | Form fields and other content. |
| `className` | `string` | - | CSS classes for the `<form>` element. |
| `...props` | `React.ComponentProps<"form">` | - | Standard form attributes (`action`, `method`, `noValidate`, etc.). |

## Design Tokens

`Form` uses no tokens directly. Child components (`Input`, `Button`, etc.) apply their own tokens.

## Examples

### Login form

```tsx
import { Form } from "@g4rcez/components/form";
import { Input } from "@g4rcez/components/input";
import { Button } from "@g4rcez/components/button";
function LoginForm({ onLogin }: { onLogin: (data: FormData) => void }) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const data = new FormData(e.currentTarget);
        onLogin(data);
    };
    return (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-base max-w-sm">
            {" "}
            <Input name="email" type="email" title="Email" autoComplete="username" required />{" "}
            <Input name="password" type="password" title="Password" autoComplete="current-password" required />{" "}
            <Button theme="primary" type="submit">
                {" "}
                Log in{" "}
            </Button>{" "}
        </Form>
    );
}
```

### Reading FormData on submit

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) });
};
<Form onSubmit={handleSubmit} className="flex flex-col gap-base">
    {" "}
    <Input name="name" title="Name" required /> <Input name="message" title="Message" />{" "}
    <Button theme="primary" type="submit">
        {" "}
        Send{" "}
    </Button>
</Form>;
```

### Multi-column layout

```tsx
<Form className="grid grid-cols-2 gap-base max-w-2xl">
    {" "}
    <Input name="firstName" title="First name" required /> <Input name="lastName" title="Last name" required />{" "}
    <Input name="email" type="email" title="Email" container="col-span-2" required />{" "}
    <Button type="submit" theme="primary" className="col-start-2">
        {" "}
        Save{" "}
    </Button>
</Form>
```

### Custom field error and predictable focus

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Form } from "@g4rcez/components/form";
import { Input } from "@g4rcez/components/input";
import { Button } from "@g4rcez/components/button";
function EmailForm({ onSave }: { onSave: (email: string) => void }) {
    const [error, setError] = useState<string>;
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        const email = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
        if (!email.validity.valid) {
            setError(email.validity.valueMissing ? "Enter your email address." : "Enter an email address such as name@example.com.");
            email.focus;
            return;
        }
        setError(undefined);
        onSave(email.value);
    };
    return (
        <Form noValidate onSubmit={handleSubmit}>
            {" "}
            <p id="contact-email-hint">Use the address where we can reply to you.</p>{" "}
            <Input
                id="contact-email"
                name="email"
                type="email"
                title="Email"
                autoComplete="email"
                required
                aria-describedby="contact-email-hint"
                error={error}
            />{" "}
            <Button theme="primary" type="submit">
                Save email
            </Button>{" "}
        </Form>
    );
}
```

- `noValidate` lets this handler run even for invalid native constraints.
- The handler refuses invalid submission, keeps the value, and focuses the first invalid field.
- It revalidates on each submit. It does not claim delivery or server success. It provides no error summary.

## Interaction design and acceptance criteria

### Validation ownership

- Use `Form` for client-handled submission. It only prevents the default submit action and calls the handler.
- `Form` does not validate, send requests, manage pending state, reset data, or choose a focus destination.
- Native browser constraints normally run before a submit event. With `noValidate`, the consumer MUST validate explicitly.
- Keep visible field labels, required/format instructions, and text errors near their controls.
- `Input`/`Textarea` provide field-level error text, `aria-invalid`, and merged description IDs.
- The `error` prop alone does not make native validity fail or block `Form` submission.
- The consumer MUST enforce business rules and keep values after rejection.
- The library has field-error support but no reusable error-summary component. A summary is a separate form-level integration duty, not a feature of `Form`, `InputField`, or `useForm`.
- A summary needs a clear title and same-page links. The links name the problems and move focus to their fields.
- Without a summary, focus the first invalid field after a rejected submission.
- Use `Button type="submit"` for pointer, touch, and keyboard submission. Native button activation supports `Enter`/`Space`.
- `Tab`/`Shift+Tab` follow the visible field/action order.
- Check that errors and summary links stay readable and operable with zoom or the virtual keyboard open.
- Do not disable submit as the only indication of what needs correction.
- Choose submit, blur, or specific-check validation timing. Do not show untouched fields as errors.
- Ordinary editing validation MUST preserve typing and focus.
- `InputField` error paragraphs already use `role="alert"`. Coordinate summary focus and live regions to avoid repeated announcements. Verify the result with desktop and mobile assistive technology.
- Distinguish empty required fields, format errors, business-rule failures, and service/network failures.
- Keep correction guidance until the chosen revalidation confirms a fix.
- An older asynchronous result MUST NOT replace the result for the current value.
- Show pending and failure states. Confirm success only after the real operation completes.
- Client validation does not replace server validation.
- Do not expose passwords in summaries, logs, or status messages.

### Using the existing useForm hook

- `useForm` is exported from `@g4rcez/components`, separately from `Form`.
- Its `input`/`textarea` helpers bind names, IDs, values, requirements, and field-error props to a synchronous Zod schema.
- `controller` supplies the form's ID/name, not submit or invalid handlers.
- Field checks listen for `blur` by default, or for a native `data-trigger` event.
- Connect `onInvalid={form.onInvalid}` explicitly for the native-invalid path.
- `form.onSubmit(callback)` calls the callback for valid and schema-invalid data. Check `success` before saving.
- On schema failure, it calls `reportValidity` and passes an `errors` list plus `setErrors` to the callback.
- It does not copy those issues into field-error state. It does not guarantee focus for schema-only errors. The consumer MUST map errors into field state and choose a focus destination.
- The hook renders no summary, gives no asynchronous schema validation or response ordering, and announces no server results.
- Its `disabled` return value reflects whether error state is non-null. It is not a complete submission or explanation policy.
- Successful schema submissions serialize parsed data to the form's `data-json` attribute. An optional storage interceptor persists state. Review both paths before using the hook with secrets.

## Verification

Acceptance criteria for tests and reviews: [verify/Form.md](verify/Form.md).

## Do

- Use `Form` instead of a raw `<form>` to avoid calling `e.preventDefault` in every submit handler.
- Include a `Button type="submit"`, so the form has an explicit keyboard- and pointer-operable submit action.
- Use design-token layout utilities (`gap-base`, `gap-sm`) for spacing between fields.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) to `Form`. Use theme props or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.
- Don't use `Form` for a traditional server-rendered full-page reload. Use a plain `<form>` with `action` and `method`.

## Accessibility

- `Form` renders a semantic `<form>` element. Supply an accessible form name when a named landmark is needed.
- Give every field a persistent associated label (`title` on `Input`, `Textarea`, and other `InputField`-based components).
- Keep hint associations when errors are added.

## Notes

- `Form` is minimal: no state, no validation logic, no styling. Child components own all field-level behavior.
- The wrapper calls `e.persist` so the synthetic event stays accessible in async submit handlers.
