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

| Prop        | Type                                                | Default | Description                                                            |
| ----------- | --------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `onSubmit`  | `(event: React.FormEvent<HTMLFormElement>) => void` | -       | Submit handler. `preventDefault` is called before this.                |
| `children`  | `React.ReactNode`                                   | -       | Form fields and other content.                                         |
| `className` | `string`                                            | -       | CSS classes for the `<form>` element.                                  |
| `...props`  | `React.ComponentProps<"form">`                      | -       | All standard form attributes (`action`, `method`, `noValidate`, etc.). |

## Design Tokens

`Form` has no direct token usage. Tokens are applied by the child components (`Input`, `Button`, etc.) placed inside it.

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

`noValidate` lets this handler run even for invalid native constraints. The handler explicitly refuses invalid submission, preserves the value, and chooses the first invalid field as the focus destination. It revalidates on each submit; it does not claim delivery, server success, or provide an error summary.

## Interaction design and acceptance criteria

Use the following integration criteria to verify the component in context.
### Validation ownership

- Use `Form` for client-handled submission. It only prevents the default submit action and calls the handler; it does not validate, send requests, manage pending state, reset data, or choose a focus destination. Native browser constraints normally run before a submit event; with `noValidate`, the consumer must validate explicitly.
- Keep visible field labels, required/format instructions, and text errors near their controls. `Input`/`Textarea` provide field-level error text, `aria-invalid`, and merged description IDs. Their `error` prop alone does not make native validity fail or block `Form` submission. The consumer must enforce business rules and retain values after rejection.
- The library has existing field-error support, but no reusable error-summary component. A summary is a separate form-level integration responsibility, not a feature of `Form`, `InputField`, or `useForm`: when provided, it needs a clear title and same-page links that name problems and move focus to their fields. For a form without a summary, choose the first invalid field as a predictable focus destination after a rejected submission.
- Pointer/touch and keyboard submission should use `Button type="submit"`; its native button activation supports `Enter`/`Space`. `Tab`/`Shift+Tab` should follow the visible field/action order. Check that errors and any summary links remain readable and operable with zoom or the virtual keyboard open. Do not disable submit as the only indication of what needs correction.
- Choose submit/blur/specific-check validation timing rather than showing untouched fields as errors. Ordinary editing validation should preserve typing and focus. `InputField` error paragraphs already use `role="alert"`; coordinate summary focus and live regions to avoid repeated announcements, and verify the resulting desktop/mobile assistive-technology behavior.
- Distinguish empty required fields, format errors, business-rule failures, and service/network failures. Keep correction guidance until the chosen revalidation confirms a fix. Asynchronous checks must not allow an older result to replace the current value's result; communicate pending/failure states and confirm success only after the real operation completes. Client validation does not replace server validation. Do not expose passwords in summaries, logs, or status messages.

### Using the existing useForm hook

`useForm` is exported from `@g4rcez/components` separately from `Form`. Its `input`/`textarea` helpers bind names, IDs, values, requirements, and field-error props to a synchronous Zod schema; `controller` supplies the form's ID/name, not submit or invalid handlers. Field checks listen for `blur` by default (or a native `data-trigger` event). Connect `onInvalid={form.onInvalid}` explicitly when using its native-invalid path. `form.onSubmit(callback)` invokes the callback for both valid and schema-invalid data: check `success` before saving. On schema failure it calls `reportValidity` and supplies an `errors` list plus `setErrors` to the callback; it does not automatically copy those issues into the field-error state or guarantee focus for schema-only errors. The consumer must map errors into the appropriate field state and select a focus destination. The hook does not render a summary, provide asynchronous schema validation/response ordering, or announce server results. Its `disabled` return value reflects whether error state is non-null; it is not a complete submission or explanation policy. Successful schema submissions serialize parsed data to the form's `data-json` attribute, and an optional storage interceptor persists state; review those paths before using the hook with secrets.

## Acceptance criteria

These are integration targets to verify, not recorded test results or accessibility certification. 1. **Given** invalid values and a submit `Button`, **when** submission is requested by click, tap, `Enter`, or `Space`, **then** saving is refused, specific field errors remain visible, entered values remain, and focus reaches the documented summary or first invalid field. 2. **Given** a hint and detected field error, **when** that field is navigated with assistive technology, **then** its label, required/invalid state, hint, and correction text are available; if a summary exists, keyboard/touch activation of each link focuses its correct same-page field without duplicate announcements. 3. **Given** several errors, **when** one field is corrected and revalidated, **then** only that field's error/state and summary entry are updated, other errors and values remain, and editing focus is not interrupted. 4. **Given** `useForm` submission integration, **when** the schema rejects data and its callback receives `success: false`, **then** no save is performed and the consumer exposes the supplied issues; native `reportValidity` is not mistaken for an error summary or guaranteed schema-error focus. 5. **Given** an asynchronous check or save, **when** it is pending, fails, or completes, **then** pending/service-failure feedback is distinguishable from field validation, stale checks do not overwrite newer values, and success is shown only after completion without including sensitive values.

## Do

- Use `Form` instead of a raw `<form>` to avoid calling `e.preventDefault` in every submit handler.
- Always include a `Button type="submit"` so the form has an explicit keyboard- and pointer-operable submit action.
- Use design-token layout utilities (`gap-base`, `gap-sm`) for consistent spacing between fields.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) to `Form` — use theme props or design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block instead.
- Don't use `Form` when you need a traditional server-rendered full-page reload; use a plain `<form>` with `action` and `method` instead.

## Accessibility

- Renders a semantic `<form>` element. Supply an accessible form name when a named landmark is needed.
- Give every field a persistent associated label (`title` on `Input`, `Textarea`, and other `InputField`-based components) and retain hint associations when errors are added.

## Notes

- `Form` is intentionally minimal — it has no state, no validation logic, and no styling. All field-level behavior is delegated to child components.
- The `e.persist` call inside the wrapper ensures the synthetic event remains accessible in async submit handlers.

```

```
