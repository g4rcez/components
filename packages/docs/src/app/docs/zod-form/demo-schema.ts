import { z } from "zod";

/**
 * Every field below is rendered by <ZodForm schema={demoSchema} />.
 * The type of each key picks the component, and .meta() carries what a type cannot say:
 * a title, a mask, the option labels, or another component.
 */
export const demoSchema = z.object({
    // string -> Input. min/max become minLength/maxLength, `placeholder` comes from .meta()
    name: z.string().min(2, "Use at least 2 characters").max(40).meta({ title: "Name", placeholder: "Ada Lovelace" }),
    // z.email() -> Input type="email"
    email: z.email("Enter a valid email").meta({ title: "Email", placeholder: "ada@example.com" }),
    // a mask from .meta() goes straight to the Input. It owns the format, so the regex is not sent as `pattern`
    document: z
        .string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Use the CPF format")
        .meta({ title: "CPF", mask: "cpf", placeholder: "000.000.000-00" }),
    phone: z.string().meta({ title: "Phone", mask: "cellphone" }),
    // a number with a money mask is typed as text and parsed back to a number on submit
    salary: z.number("Enter a salary").min(1000, "The minimum is 1.000").meta({ title: "Salary", mask: "money", currency: "BRL", locale: "pt-BR" }),
    // number -> Input type="number". int() adds step=1, min/max are copied
    age: z.number("Enter your age").int().min(18, "You must be 18 or older").max(99).meta({ title: "Age" }),
    // optional() is not required. component picks another control for the same string
    bio: z.string().max(200).optional().meta({ title: "Bio", component: "textarea", description: "Optional, up to 200 characters." }),
    // enum -> Select. The options are the values, the texts come from labels. default() is the selected value
    role: z
        .enum(["admin", "editor", "viewer"])
        .default("editor")
        .meta({ title: "Role", labels: { admin: "Administrator", editor: "Editor", viewer: "Viewer" } }),
    // the same enum as an Autocomplete
    language: z.enum(["ts", "js", "ex", "kt"], "Pick a language").meta({
        title: "Favorite language",
        component: "autocomplete",
        labels: { ts: "TypeScript", js: "JavaScript", ex: "Elixir", kt: "Kotlin" },
    }),
    // ...or as a group of Radioboxes
    plan: z
        .enum(["free", "pro", "team"])
        .default("free")
        .meta({ title: "Plan", component: "radio", labels: { free: "Free", pro: "Pro", team: "Team" } }),
    // array of enum -> MultiSelect
    skills: z
        .array(z.enum(["react", "node", "sql", "rust"]))
        .min(1, "Pick at least one skill")
        .default(["react"])
        .meta({ title: "Skills", labels: { react: "React", node: "Node.js", sql: "SQL", rust: "Rust" } }),
    // boolean -> Checkbox, or a Switch
    newsletter: z.boolean().default(true).meta({ title: "Send me the newsletter", component: "switch" }),
    // literal(true) is a required checkbox
    terms: z.literal(true, { error: "You must accept the terms" }).meta({ title: "I accept the terms" }),
    // a number as a Slider. It starts at its default
    experience: z.number().min(0).max(30).default(5).meta({ title: "Years of experience", component: "slider" }),
    // z.date() -> DatePicker storing a Date. min/max disable the days outside the range
    birthday: z
        .date("Pick your birthday")
        .min(new Date(1900, 0, 1))
        .max(new Date(2099, 11, 31))
        .meta({ title: "Birthday" }),
    // z.iso.datetime() -> DatePicker with time, storing an ISO string
    interview: z.iso.datetime("Pick a slot").meta({ title: "Interview slot" }),
    status: z
        .enum(["todo", "doing", "done"])
        .default("todo")
        .meta({ title: "Status", component: "morph", labels: { todo: "To do", doing: "Doing", done: "Done" } }),
    // z.file() -> FileUpload. mime() is the accept list, max() the size limit
    avatar: z
        .file()
        .mime(["image/png", "image/jpeg"])
        .max(2 * 1024 * 1024)
        .optional()
        .meta({ title: "Avatar" }),
    // object -> a group of fields
    address: z
        .object({
            street: z.string().min(1, "Street is required").meta({ title: "Street" }),
            city: z.string().default("Recife").meta({ title: "City" }),
        })
        .meta({ title: "Address" }),
    // array of objects -> repeatable rows. min(1) starts with one row
    contacts: z
        .array(
            z.object({
                label: z.string().min(1, "Label is required").meta({ title: "Label" }),
                phone: z.string().meta({ title: "Phone", mask: "cellphone" }),
            })
        )
        .min(1, "Add at least one contact")
        .meta({ title: "Contacts" }),
});
