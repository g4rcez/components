import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ZodFormDemo } from "./zod-form-demo";

/** The schema shown on the page is the file the live form runs, read at build time so the two never drift. */
const source = readFileSync(join(process.cwd(), "src/app/docs/zod-form/demo-schema.ts"), "utf8");

export default function ZodFormPage() {
    return <ZodFormDemo schemaSource={source} />;
}
