import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
    coerceFormValues,
    describeField,
    fieldConstraintProps,
    getSchemaAtPath,
    getSchemaDefaults,
    parseLocaleNumber,
    unwrapSchema,
    zodToFields,
} from "../src/lib/zod-fields";

const field = (schema: z.ZodType, name = "field") => describeField(name, schema);

describe("zod field kinds", () => {
    it.each([
        ["string", z.string(), "string", "input"],
        ["email", z.email(), "string", "input"],
        ["number", z.number(), "number", "input"],
        ["int", z.int(), "number", "input"],
        ["boolean", z.boolean(), "boolean", "checkbox"],
        ["literal true", z.literal(true), "boolean", "checkbox"],
        ["enum", z.enum(["a", "b"]), "enum", "select"],
        ["literal union", z.union([z.literal("a"), z.literal("b")]), "enum", "select"],
        ["multi", z.array(z.enum(["a", "b"])), "multi", "multiselect"],
        ["array of strings", z.array(z.string()), "multi", "multiselect"],
        ["array of objects", z.array(z.object({ a: z.string() })), "array", "list"],
        ["object", z.object({ a: z.string() }), "object", "group"],
        ["iso date", z.iso.date(), "date", "datepicker"],
        ["iso datetime", z.iso.datetime(), "datetime", "datepicker"],
        ["date", z.date(), "date", "datepicker"],
        ["file", z.file(), "file", "file"],
        ["files", z.array(z.file()), "file", "file"],
    ] as const)("infers %s", (_label, schema, kind, component) => {
        const described = field(schema);
        expect(described.kind).toBe(kind);
        expect(described.component).toBe(component);
    });

    it("records how dates are stored", () => {
        expect(field(z.iso.date()).storage).toBe("iso-date");
        expect(field(z.iso.datetime()).storage).toBe("iso-datetime");
        expect(field(z.date()).storage).toBe("date");
    });

    it("lets .meta({ component }) override the inferred component", () => {
        expect(field(z.enum(["a"]).meta({ component: "autocomplete" })).component).toBe("autocomplete");
        expect(field(z.boolean().meta({ component: "switch" })).component).toBe("switch");
        expect(field(z.string().meta({ component: "textarea" })).component).toBe("textarea");
        expect(field(z.number().min(0).max(10).meta({ component: "slider" })).component).toBe("slider");
    });
});

describe("zod wrappers", () => {
    it("reads required, optional, nullable and default", () => {
        expect(field(z.string().min(1)).required).toBe(true);
        expect(field(z.string().optional()).required).toBe(false);
        expect(field(z.string().nullable()).nullable).toBe(true);
        const withDefault = field(z.string().default("hello"));
        expect(withDefault.required).toBe(false);
        expect(withDefault.hasDefault).toBe(true);
        expect(withDefault.defaultValue).toBe("hello");
    });

    it("does not require a plain string, because the schema accepts an empty one", () => {
        expect(field(z.string()).required).toBe(false);
        expect(field(z.string().min(1)).required).toBe(true);
        expect(field(z.email()).required).toBe(true);
        expect(field(z.string().regex(/^\d+$/)).required).toBe(true);
        expect(field(z.enum(["a"])).required).toBe(true);
        expect(field(z.number()).required).toBe(true);
    });

    it("only requires a boolean when it is literal true", () => {
        expect(field(z.boolean()).required).toBe(false);
        expect(field(z.literal(true)).required).toBe(true);
    });

    it("reads the input side of a pipe and of a preprocess", () => {
        expect(
            field(
                z
                    .string()
                    .min(2)
                    .transform((x) => x.toUpperCase())
            ).constraints.minLength
        ).toBe(2);
        expect(field(z.preprocess((x) => x, z.number())).kind).toBe("number");
    });

    it("merges metadata through wrappers and lets the outer one win", () => {
        const inner = field(z.string().meta({ mask: "cpf", title: "CPF" }).optional());
        expect(inner.mask).toBe("cpf");
        expect(inner.title).toBe("CPF");
        const outer = field(z.string().meta({ title: "Inner" }).optional().meta({ title: "Outer" }));
        expect(outer.title).toBe("Outer");
        expect(unwrapSchema(z.string().optional().meta({ placeholder: "x" })).meta.placeholder).toBe("x");
    });

    it("takes the title from .meta(), the description as info, and humanizes the key otherwise", () => {
        const described = field(z.string().meta({ title: "Full name", description: "As on your ID" }));
        expect(described.title).toBe("Full name");
        expect(described.info).toBe("As on your ID");
        expect(field(z.string(), "firstName").title).toBe("First name");
        expect(field(z.string(), "items[0].zip_code").title).toBe("Zip code");
    });
});

describe("zod constraints", () => {
    it("derives string constraints", () => {
        const described = field(
            z
                .string()
                .min(2)
                .max(8)
                .regex(/^[a-z]+$/)
        );
        expect(described.constraints).toMatchObject({ minLength: 2, maxLength: 8, pattern: "^[a-z]+$" });
        expect(fieldConstraintProps(described)).toMatchObject({ required: true, minLength: 2, maxLength: 8, pattern: "^[a-z]+$" });
    });

    it("maps email and url formats to input types", () => {
        expect(field(z.email()).constraints.type).toBe("email");
        expect(field(z.string().email()).constraints.type).toBe("email");
        expect(field(z.url()).constraints.type).toBe("url");
    });

    it("skips the native pattern when a mask owns the format", () => {
        expect(field(z.string().regex(/^\d+$/).meta({ mask: "cpf" })).constraints.pattern).toBeUndefined();
    });

    it("skips a regex that carries flags, which the pattern attribute cannot express", () => {
        expect(field(z.string().regex(/^a/i)).constraints.pattern).toBeUndefined();
    });

    it("derives number constraints", () => {
        expect(field(z.number().min(1).max(9).multipleOf(2)).constraints).toMatchObject({ type: "number", min: 1, max: 9, step: 2 });
        expect(field(z.int().min(0)).constraints).toMatchObject({ min: 0, step: 1 });
        expect(field(z.int().gt(1).lt(5)).constraints).toMatchObject({ min: 2, max: 4 });
    });

    it("uses a text input for a masked number", () => {
        expect(field(z.number().meta({ mask: "money" })).constraints.type).toBe("text");
    });

    it("derives array, file and date constraints", () => {
        expect(field(z.array(z.string()).min(1).max(3)).constraints).toMatchObject({ minItems: 1, maxItems: 3 });
        expect(field(z.file().mime(["image/png"]).max(100)).constraints).toMatchObject({ accept: "image/png", maxSize: 100, multiple: false });
        expect(field(z.array(z.file().mime(["image/png"]))).constraints).toMatchObject({ accept: "image/png", multiple: true });
        const min = new Date(2020, 0, 1);
        const max = new Date(2030, 0, 1);
        expect(field(z.date().min(min).max(max)).constraints).toMatchObject({ minDate: min, maxDate: max });
    });

    it("maps a uuid to the uuid mask", () => {
        expect(field(z.uuid()).mask).toBe("uuid");
    });
});

describe("zod options", () => {
    it("lists enum values and applies labels", () => {
        const described = field(z.enum(["ex", "js"]).meta({ labels: { ex: "Elixir" } }));
        expect(described.options).toEqual([
            { value: "ex", label: "Elixir" },
            { value: "js", label: "js" },
        ]);
    });

    it("lists literal unions and native enums", () => {
        expect(field(z.union([z.literal("a"), z.literal("b")])).options.map((x) => x.value)).toEqual(["a", "b"]);
        enum Color {
            Red = "red",
            Blue = "blue",
        }
        expect(field(z.enum(Color)).options.map((x) => x.value)).toEqual(["red", "blue"]);
    });

    it("lets .meta({ options }) supply the options of an array of strings", () => {
        const described = field(z.array(z.string()).meta({ options: ["a", { value: "b", label: "Bee" }] }));
        expect(described.options).toEqual([
            { value: "a", label: "a" },
            { value: "b", label: "Bee" },
        ]);
    });
});

describe("zod objects and paths", () => {
    const schema = z.object({
        name: z.string().default("Ada"),
        address: z.object({ street: z.string().min(1), city: z.string().default("Recife") }),
        items: z.array(z.object({ title: z.string() })),
        tags: z.array(z.string()),
    });

    it("describes children and array elements", () => {
        const [name, address, items] = zodToFields(schema);
        expect(name?.name).toBe("name");
        expect(address?.children.map((x) => x.name)).toEqual(["address.street", "address.city"]);
        expect(items?.element?.children.map((x) => x.name)).toEqual(["items[].title"]);
    });

    it("collects defaults, nested objects included, and defaults arrays to []", () => {
        expect(getSchemaDefaults(schema)).toEqual({ name: "Ada", address: { city: "Recife" }, items: [], tags: [] });
    });

    it("resolves a schema by path", () => {
        expect(getSchemaAtPath(schema, "address.street")).toBeDefined();
        expect(describeField("x", getSchemaAtPath(schema, "items[0].title")!).kind).toBe("string");
        expect(describeField("x", getSchemaAtPath(schema, "items[].title")!).kind).toBe("string");
        expect(getSchemaAtPath(schema, "missing.path")).toBeUndefined();
    });
});

describe("coerceFormValues", () => {
    const schema = z.object({
        age: z.number(),
        score: z.number().optional(),
        price: z.number().meta({ mask: "money", locale: "pt-BR" }),
        agree: z.boolean(),
        optIn: z.boolean().optional(),
        name: z.string().min(1),
        nickname: z.string().optional(),
        main: z.enum(["a", "b"]),
        level: z.union([z.literal(1), z.literal(2)]),
        tags: z.array(z.string()),
        born: z.date(),
        iso: z.iso.date(),
        address: z.object({ zip: z.string() }),
        items: z.array(z.object({ qty: z.number() })),
    });

    it("converts posted strings to the schema types", () => {
        const result = coerceFormValues(schema, {
            age: "42",
            score: "",
            price: "R$ 1.234,56",
            agree: "on",
            name: "",
            nickname: "",
            main: "b",
            level: "2",
            tags: "x,y",
            born: "2020-02-03",
            iso: "2020-02-03",
            address: { zip: "123" },
            items: [{ qty: "3" }],
        });
        expect(result).toMatchObject({
            age: 42,
            price: 1234.56,
            agree: true,
            name: "",
            main: "b",
            level: 2,
            tags: ["x", "y"],
            iso: "2020-02-03",
            address: { zip: "123" },
            items: [{ qty: 3 }],
        });
        expect(result.born).toBeInstanceOf(Date);
        expect("score" in result).toBe(false);
        expect("nickname" in result).toBe(false);
        expect("optIn" in result).toBe(false);
    });

    it("treats an unchecked required checkbox as false and parses the result", () => {
        const result = coerceFormValues(schema, {
            age: "1",
            price: "R$ 1,00",
            name: "n",
            main: "a",
            level: "1",
            tags: "",
            born: "2020-01-01",
            iso: "2020-01-01",
            address: { zip: "1" },
        });
        expect(result.agree).toBe(false);
        expect(result.tags).toEqual([]);
        expect(schema.safeParse(result).success).toBe(true);
    });

    it("leaves values that cannot be converted so zod reports them", () => {
        expect(coerceFormValues(schema, { age: "abc" }).age).toBe("abc");
        expect(schema.safeParse(coerceFormValues(schema, { age: "abc" })).success).toBe(false);
    });

    it("parses locale numbers", () => {
        expect(parseLocaleNumber("R$ 1.234,56", "pt-BR")).toBe(1234.56);
        expect(parseLocaleNumber("$1,234.56", "en-US")).toBe(1234.56);
        expect(parseLocaleNumber("-R$ 10,00", "pt-BR")).toBe(-10);
    });
});
