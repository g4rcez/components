import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ZodForm } from "../src/components/form/zod-form/zod-form";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

/** One schema that reaches every form component the library ships. */
const schema = z.object({
    name: z.string().min(2, "Name is too short").max(20).meta({ title: "Name", placeholder: "Ada Lovelace" }),
    email: z.email("Invalid email").meta({ title: "Email" }),
    document: z.string().meta({ title: "Document", mask: "cpf" }),
    age: z.number().min(18).max(99).meta({ title: "Age" }),
    bio: z.string().max(200).optional().meta({ title: "Bio", component: "textarea" }),
    role: z
        .enum(["admin", "member", "guest"])
        .default("member")
        .meta({ title: "Role", labels: { admin: "Administrator" } }),
    language: z.enum(["ts", "js", "ex"]).meta({
        title: "Language",
        component: "autocomplete",
        labels: { ts: "TypeScript", js: "JavaScript", ex: "Elixir" },
    }),
    plan: z
        .enum(["free", "pro"])
        .default("free")
        .meta({ title: "Plan", component: "radio", labels: { free: "Free plan", pro: "Pro plan" } }),
    tags: z
        .array(z.enum(["a", "b", "c"]))
        .default(["a"])
        .meta({ title: "Tags", labels: { a: "Alpha", b: "Bravo", c: "Charlie" } }),
    newsletter: z.boolean().default(true).meta({ title: "Newsletter", component: "switch" }),
    terms: z.literal(true, { error: "Accept the terms" }).meta({ title: "Terms" }),
    volume: z.number().min(0).max(10).default(3).meta({ title: "Volume", component: "slider" }),
    birthday: z.date().meta({ title: "Birthday" }),
    status: z
        .enum(["todo", "done"])
        .default("todo")
        .meta({ title: "Status", component: "morph", labels: { todo: "Todo", done: "Done" } }),
    avatar: z.file().mime(["image/png"]).optional().meta({ title: "Avatar" }),
    address: z.object({ street: z.string().min(1).meta({ title: "Street" }), city: z.string().default("Recife").meta({ title: "City" }) }),
    contacts: z
        .array(z.object({ label: z.string().min(1).meta({ title: "Label" }), phone: z.string().meta({ title: "Phone", mask: "cellphone" }) }))
        .min(1),
});

type FormProps = React.ComponentProps<typeof ZodForm>;

const renderForm = (props: Partial<FormProps> = {}) =>
    render(
        <ComponentsProvider locale="en-US">
            <ZodForm schema={schema} name="zod-form" {...(props as object)} />
        </ComponentsProvider>
    );

const named = (container: HTMLElement, name: string) => container.querySelector<HTMLInputElement>(`[name="${name}"]`) as HTMLInputElement;

const submit = () => screen.getByRole("button", { name: "Submit" });

describe("ZodForm rendering", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
        vi.stubGlobal(
            "IntersectionObserver",
            class IntersectionObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
                takeRecords() {
                    return [];
                }
            }
        );
    });
    afterEach(() => vi.unstubAllGlobals());

    it("renders the component each schema type asks for", () => {
        const { container } = renderForm();

        expect(named(container, "name")).toHaveAttribute("type", "text");
        expect(named(container, "email")).toHaveAttribute("type", "email");
        expect(screen.getByRole("spinbutton", { name: /Age/ })).toBeInTheDocument();
        expect(named(container, "bio").tagName).toBe("TEXTAREA");
        expect(named(container, "role").tagName).toBe("SELECT");
        expect(named(container, "language-shadow")).toHaveAttribute("role", "combobox");
        expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
        expect(within(screen.getByRole("radiogroup", { name: "Plan" })).getAllByRole("radio")).toHaveLength(2);
        expect(screen.getByRole("combobox", { name: /Tags/ })).toBeInTheDocument();
        expect(screen.getByRole("switch", { name: "Newsletter" })).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Terms" })).toBeInTheDocument();
        expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
        expect(named(container, "birthday")).toHaveAttribute("type", "date");
        expect(screen.getByRole("combobox", { name: /Status/ })).toBeInTheDocument();
        expect(container.querySelector('input[type="file"]')).not.toBeNull();
        expect(screen.getByRole("group", { name: "Address" })).toBeInTheDocument();
        expect(screen.getByRole("group", { name: "Contacts" })).toBeInTheDocument();
        expect(submit()).toBeInTheDocument();
    });

    it("turns schema constraints into native attributes", () => {
        const { container } = renderForm();

        expect(named(container, "name")).toBeRequired();
        expect(named(container, "name")).toHaveAttribute("minlength", "2");
        expect(named(container, "name")).toHaveAttribute("maxlength", "20");
        expect(named(container, "name")).toHaveAttribute("placeholder", "Ada Lovelace");
        expect(named(container, "age")).toHaveAttribute("min", "18");
        expect(named(container, "age")).toHaveAttribute("max", "99");
        expect(named(container, "bio")).not.toBeRequired();
        expect(named(container, "bio")).toHaveAttribute("maxlength", "200");
        expect(named(container, "terms")).toBeRequired();
        expect(named(container, "newsletter")).not.toBeRequired();
        expect(named(container, "volume")).toHaveAttribute("min", "0");
        expect(named(container, "volume")).toHaveAttribute("max", "10");
        expect(named(container, "language-shadow")).toBeRequired();
    });

    it("sends the schema mask to the Input", async () => {
        const user = userEvent.setup();
        const { container } = renderForm();

        await user.type(named(container, "document"), "12345678901");
        expect(named(container, "document")).toHaveValue("123.456.789-01");

        await user.type(named(container, "contacts[0].phone"), "81987654321");
        expect(named(container, "contacts[0].phone")).toHaveValue("(81) 98765-4321");
    });

    it("builds the options of selects from the schema and its labels", () => {
        const { container } = renderForm();

        const role = named(container, "role") as unknown as HTMLSelectElement;
        const options = Array.from(role.options).filter((option) => option.value !== "");
        expect(options.map((option) => [option.value, option.textContent])).toEqual([
            ["admin", "Administrator"],
            ["member", "member"],
            ["guest", "guest"],
        ]);
    });

    it("prefills every control from .default()", () => {
        const { container } = renderForm();

        expect(named(container, "role")).toHaveValue("member");
        expect(screen.getByRole("radio", { name: "Free plan" })).toBeChecked();
        expect(screen.getByRole("radio", { name: "Pro plan" })).not.toBeChecked();
        expect(named(container, "tags")).toHaveValue("a");
        expect(screen.getByText("Alpha")).toBeInTheDocument();
        expect(screen.getByRole("switch", { name: "Newsletter" })).toHaveAttribute("aria-checked", "true");
        expect(named(container, "volume")).toHaveValue("3");
        expect(named(container, "status")).toHaveValue("todo");
        expect(named(container, "address.city")).toHaveValue("Recife");
    });

    it("lets state override the schema defaults and fills the DatePicker", async () => {
        const { container } = renderForm({ state: { name: "Grace", role: "guest", birthday: new Date(1990, 1, 3) } });

        expect(named(container, "name")).toHaveValue("Grace");
        expect(named(container, "role")).toHaveValue("guest");
        expect(named(container, "address.city")).toHaveValue("Recife");
        await waitFor(() => expect(container.querySelector('input[data-target="birthday"]')).toHaveValue("02/03/1990"));
    });

    it("starts an array with .min(n) blank rows", () => {
        const { container } = renderForm();

        expect(named(container, "contacts[0].label")).toBeInTheDocument();
        expect(container.querySelector('[name="contacts[1].label"]')).toBeNull();
    });

    it("merges props passed by field path over the schema", () => {
        const { container } = renderForm({
            fields: { name: { placeholder: "Override" }, "contacts[].label": { placeholder: "Row label" } },
        });

        expect(named(container, "name")).toHaveAttribute("placeholder", "Override");
        expect(named(container, "contacts[0].label")).toHaveAttribute("placeholder", "Row label");
    });

    it("lets a field render with custom markup", () => {
        renderForm({ render: { age: ({ field }) => <p>custom {field.name}</p> } });

        expect(screen.getByText("custom age")).toBeInTheDocument();
        expect(screen.queryByRole("spinbutton", { name: /Age/ })).not.toBeInTheDocument();
    });

    it("can drop the submit button and render a footer", () => {
        renderForm({ footer: false });
        expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();
    });
});

describe("ZodForm array rows", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
    });
    afterEach(() => vi.unstubAllGlobals());

    it("adds and removes rows and keeps the values with their row", async () => {
        const user = userEvent.setup();
        const { container } = renderForm();

        await user.type(named(container, "contacts[0].label"), "Home");
        await user.click(screen.getByRole("button", { name: "Add Contacts" }));
        await user.type(named(container, "contacts[1].label"), "Work");
        expect(named(container, "contacts[1].label")).toHaveValue("Work");

        await user.click(screen.getByRole("button", { name: "Remove Contacts 1" }));

        expect(container.querySelector('[name="contacts[1].label"]')).toBeNull();
        expect(named(container, "contacts[0].label")).toHaveValue("Work");
    });
});

describe("ZodForm submit", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
        vi.stubGlobal(
            "IntersectionObserver",
            class IntersectionObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
                takeRecords() {
                    return [];
                }
            }
        );
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.spyOn(console, "info").mockImplementation(() => {});
        vi.spyOn(console, "group").mockImplementation(() => {});
        vi.spyOn(console, "groupEnd").mockImplementation(() => {});
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("blocks an empty submit and shows the schema message of each invalid field", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const { container } = renderForm({ onSubmit });

        await user.click(submit());

        expect(onSubmit).not.toHaveBeenCalled();
        await waitFor(() => expect(container.querySelector("#name-error")).toHaveTextContent("Name is too short"));
        expect(container.querySelector("#email-error")).toHaveTextContent("Invalid email");
        expect(named(container, "name")).toHaveAttribute("aria-invalid", "true");
    });

    it("submits typed data parsed by the schema after every component is filled", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const { container } = renderForm({ onSubmit, state: { birthday: new Date(1990, 1, 3) } });

        await user.type(named(container, "name"), "Ada Lovelace");
        await user.type(named(container, "email"), "ada@example.com");
        await user.type(named(container, "document"), "12345678901");
        await user.type(named(container, "age"), "36");
        await user.selectOptions(named(container, "role") as unknown as HTMLSelectElement, "admin");
        await user.click(screen.getByRole("radio", { name: "Pro plan" }));
        await user.click(screen.getByRole("switch", { name: "Newsletter" }));
        await user.click(screen.getByRole("checkbox", { name: "Terms" }));
        fireEvent.change(named(container, "volume"), { target: { value: "7" } });
        await user.type(named(container, "address.street"), "Rua A");
        await user.type(named(container, "contacts[0].label"), "Home");
        await user.type(named(container, "contacts[0].phone"), "81987654321");

        await user.click(screen.getByRole("combobox", { name: /Tags/ }));
        await user.click(await screen.findByRole("option", { name: "Bravo" }));
        await user.keyboard("{Escape}");
        await user.click(screen.getByRole("combobox", { name: /Status/ }));
        await user.click(await screen.findByRole("option", { name: "Done" }));
        await user.click(named(container, "language-shadow"));
        await user.click(await screen.findByRole("option", { name: "TypeScript" }));

        await user.click(submit());

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        const args = onSubmit.mock.calls[0]?.[1];
        expect(args.success).toBe(true);
        expect(args.data).toMatchObject({
            name: "Ada Lovelace",
            email: "ada@example.com",
            document: "123.456.789-01",
            age: 36,
            role: "admin",
            language: "ts",
            plan: "pro",
            tags: ["a", "b"],
            newsletter: false,
            terms: true,
            volume: 7,
            status: "done",
            address: { street: "Rua A", city: "Recife" },
            contacts: [{ label: "Home", phone: "(81) 98765-4321" }],
        });
        expect(args.data.birthday).toBeInstanceOf(Date);
        expect(args.data.birthday.getFullYear()).toBe(1990);
        expect("bio" in args.data && args.data.bio !== undefined).toBe(false);
        expect(args.data.avatar).toBeUndefined();
    });

    it("clears a field error as soon as the value becomes valid, even without a blur", async () => {
        const user = userEvent.setup();
        const { container } = renderForm();

        await user.click(submit());
        await waitFor(() => expect(container.querySelector("#terms-error")).toHaveTextContent("Accept the terms"));

        await user.click(screen.getByRole("checkbox", { name: "Terms" }));

        await waitFor(() => expect(container.querySelector("#terms-error")).toBeNull());
        expect(named(container, "terms")).not.toHaveAttribute("aria-invalid", "true");
        expect(container.querySelector("#email-error")).toHaveTextContent("Invalid email");
    });

    it("sends a dropped file to the schema", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const { container } = renderForm({
            onSubmit,
            state: {
                name: "Ada Lovelace",
                email: "ada@example.com",
                document: "123.456.789-01",
                age: 36,
                language: "js",
                terms: true,
                birthday: new Date(1990, 1, 3),
                address: { street: "Rua A", city: "Recife" },
                contacts: [{ label: "Home", phone: "(81) 98765-4321" }],
            },
        });
        const png = new File(["png"], "avatar.png", { type: "image/png" });

        await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, png);
        await user.click(submit());

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        const args = onSubmit.mock.calls[0]?.[1];
        expect(args.success).toBe(true);
        expect(args.data.avatar).toBeInstanceOf(File);
        expect(args.data.avatar.name).toBe("avatar.png");
    });

    it("reports schema level issues that native validation cannot see", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const passwords = z
            .object({ password: z.string().min(1), confirm: z.string().min(1) })
            .refine((value) => value.password === value.confirm, { path: ["confirm"], error: "Passwords differ" });
        const { container } = render(
            <ComponentsProvider locale="en-US">
                <ZodForm schema={passwords} name="passwords" onSubmit={onSubmit} />
            </ComponentsProvider>
        );

        await user.type(named(container, "password"), "abc");
        await user.type(named(container, "confirm"), "abd");
        await user.click(submit());

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit.mock.calls[0]?.[1].success).toBe(false);
        expect(onSubmit.mock.calls[0]?.[1].errors).toEqual([{ message: "Passwords differ", path: ["confirm"] }]);
        await waitFor(() => expect(container.querySelector("#confirm-error")).toHaveTextContent("Passwords differ"));
    });
});
