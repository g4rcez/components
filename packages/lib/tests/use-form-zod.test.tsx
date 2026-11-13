import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { getSchemaShape, useForm } from "../src/hooks/use-form";

const schema = z.object({
    name: z.string().min(2).max(10).meta({ title: "Name", placeholder: "Ada", description: "Your name" }),
    document: z.string().meta({ mask: "cpf", title: "CPF" }),
    price: z.number().min(1).max(500).multipleOf(5).meta({ mask: "money", currency: "BRL", locale: "pt-BR" }),
    age: z.number().min(18).max(99),
    role: z
        .enum(["admin", "member"])
        .default("member")
        .meta({ labels: { admin: "Administrator" } }),
    tags: z.array(z.enum(["a", "b"])).default(["a"]),
    free: z.array(z.string()),
    agree: z.literal(true),
    newsletter: z.boolean().default(true),
    volume: z.number().min(0).max(10).meta({ component: "slider" }),
    day: z.iso.date(),
    moment: z.iso.datetime(),
    born: z.date().min(new Date(1900, 0, 1)),
    avatar: z.file().mime(["image/png", "image/jpeg"]).max(1024),
    photos: z.array(z.file()),
    address: z.object({ city: z.string().default("Recife") }),
    rows: z.array(z.object({ title: z.string().default("untitled") })).min(1),
});

const setup = (state?: Partial<z.input<typeof schema>>) => renderHook(() => useForm(schema, "hook-form", { state }));

describe("useForm derives props from the schema", () => {
    it("fills the state with .default(), nested objects and blank rows", () => {
        const { result } = setup();

        expect(result.current.state).toMatchObject({
            role: "member",
            tags: ["a"],
            free: [],
            newsletter: true,
            address: { city: "Recife" },
            rows: [{ title: "untitled" }],
        });
        expect(result.current.state.name).toBeUndefined();
    });

    it("merges an explicit state over the defaults", () => {
        const { result } = setup({ role: "admin", address: { city: "Olinda" } });

        expect(result.current.state).toMatchObject({ role: "admin", tags: ["a"], address: { city: "Olinda" } });
    });

    it("sends text constraints, title, info and placeholder to Input", () => {
        const { result } = setup();
        const props = result.current.input("name");

        expect(props).toMatchObject({
            name: "name",
            required: true,
            minLength: 2,
            maxLength: 10,
            title: "Name",
            info: "Your name",
            placeholder: "Ada",
            value: "",
        });
    });

    it("sends the mask, and the currency and locale of a money mask, to Input", () => {
        const { result } = setup();

        expect(result.current.input("document")).toMatchObject({ mask: "cpf", title: "CPF" });
        expect(result.current.input("document")).not.toHaveProperty("maxLength");
        expect(result.current.input("price")).toMatchObject({ mask: "money", currency: "BRL", locale: "pt-BR", type: "text" });
    });

    it("types number inputs with min, max and step", () => {
        const { result } = setup();

        expect(result.current.input("age")).toMatchObject({ type: "number", min: 18, max: 99, required: true });
        expect(result.current.input("price")).toMatchObject({ step: 5, min: 1, max: 500 });
    });

    it("lets explicit props win over the schema", () => {
        const { result } = setup();
        const props = result.current.input("document", { mask: "cnpj", title: "Other", required: false });

        expect(props).toMatchObject({ mask: "cnpj", title: "Other", required: false });
    });

    it("builds select options from an enum and applies its labels", () => {
        const { result } = setup();
        const props = result.current.select("role");

        expect(props.options).toEqual([
            { value: "admin", label: "Administrator" },
            { value: "member", label: "member" },
        ]);
        expect(props.value).toBe("member");
    });

    it("builds multiselect options and falls back to user created options for free strings", () => {
        const { result } = setup();

        expect(result.current.multiselect("tags")).toMatchObject({ value: ["a"], options: [{ value: "a" }, { value: "b" }] });
        expect(result.current.multiselect("free")).toMatchObject({ value: [], dynamicOption: true });
        expect(result.current.multiselect("free").options).toBeUndefined();
    });

    it("requires a checkbox only for literal true and seeds defaultChecked from the default", () => {
        const { result } = setup();

        expect(result.current.checkbox("agree").required).toBe(true);
        expect(result.current.checkbox("newsletter")).toMatchObject({ required: false, defaultChecked: true });
    });

    it("describes slider, file, radio and morph props", () => {
        const { result } = setup();

        expect(result.current.slider("volume")).toMatchObject({ min: 0, max: 10, value: 0, name: "volume" });
        expect(result.current.file("avatar")).toMatchObject({
            multiple: false,
            maxSize: 1024,
            accept: { "image/png": [], "image/jpeg": [] },
            files: [],
        });
        expect(result.current.file("photos")).toMatchObject({ multiple: true });
        expect(result.current.radio("role", "admin")).toMatchObject({ name: "role", value: "admin", checked: false, id: "role-admin" });
        expect(result.current.radio("role", "member").checked).toBe(true);
        expect(result.current.morph("role").items).toEqual([
            { value: "admin", label: "Administrator" },
            { value: "member", label: "member" },
        ]);
        expect(result.current.morph("role")).toMatchObject({ value: "member", label: "Role", name: "role" });
    });

    it("exposes the descriptors of the schema", () => {
        const { result } = setup();

        expect(result.current.fields.map((field) => field.name)).toContain("address");
        expect(result.current.field("agree")).toMatchObject({ kind: "boolean", required: true });
        expect(result.current.field("rows[0].title").defaultValue).toBe("untitled");
        expect(getSchemaShape("age", schema)).toBeDefined();
    });

    it("stores a date in the shape the schema declares", () => {
        const { result } = setup();
        const date = new Date(1990, 1, 3, 10, 30);

        act(() => result.current.datepicker("day").onChange?.(date as never));
        act(() => result.current.datepicker("moment").onChange?.(date as never));
        act(() => result.current.datepicker("born").onChange?.(date as never));

        expect(result.current.state.day).toBe("1990-02-03");
        expect(result.current.state.moment).toBe(date.toISOString());
        expect(result.current.state.born).toEqual(date);
        expect(result.current.datepicker("day").date).toEqual(new Date(1990, 1, 3));
        expect(result.current.datepicker("moment")).toMatchObject({ type: "datetime" });
    });

    it("limits the days a DatePicker offers to the dates of the schema", () => {
        const { result } = setup();
        const disabled = (result.current.datepicker("born") as unknown as { disabledDate: (date: Date) => boolean }).disabledDate;

        expect(disabled(new Date(1800, 0, 1))).toBe(true);
        expect(disabled(new Date(1950, 0, 1))).toBe(false);
    });

    it("appends rows from the defaults of the element and removes them by index", () => {
        const { result } = setup();

        act(() => result.current.append("rows"));
        expect(result.current.state.rows).toEqual([{ title: "untitled" }, { title: "untitled" }]);

        act(() => result.current.setState((prev) => ({ ...prev, rows: [{ title: "first" }, { title: "second" }] })));
        act(() => result.current.remove("rows", 0));
        expect(result.current.state.rows).toEqual([{ title: "second" }]);
    });

    it("keeps a falsy value a number input reports", () => {
        const { result } = setup({ age: 0 });

        expect(result.current.input("age").value).toBe(0);
    });
});
