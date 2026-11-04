"use client";
import { useState } from "react";
import { RichTextEditor, type RichTextSelection } from "@g4rcez/components/rich-text-editor";
import { Checkbox } from "@g4rcez/components/checkbox";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";

const example =
    "# Release review\n\nWrite **clear notes** with *context* and ~~outdated details~~.\n\n- [x] Review changes\n- [ ] Share the summary\n\n> Keep the original source until you make an edit.\n\n| Owner | Next step |\n| --- | --- |\n| Design | Review keyboard flow |\n\n[Project guide](https://example.com/guide)\n\n```ts\nconst ready = true;\n```";

export default function RichTextEditorPage() {
    const [value, setValue] = useState(example);
    const [readOnly, setReadOnly] = useState(false);
    const [selection, setSelection] = useState<RichTextSelection | null>(null);
    const [unsupported, setUnsupported] = useState("# Preserved source\n\n<div>This raw HTML stays source-only.</div>");
    return (
        <DocsLayout
            title="RichTextEditor"
            section="form"
            description="Edit GFM Markdown visually or as exact source, without a destructive view conversion."
            useWhen="People need headings, lists, checklists, tables, links and image references in Markdown documents."
            avoidWhen="You need arbitrary HTML editing, binary uploads, Word layout or lossless support for every Markdown extension."
            accessibility="Give every editor a label. Tab through formatting actions; use standard text-editing shortcuts. Read-only preserves selection and view switching. Escape cancels URL entry and restores editor focus."
        >
            <ComponentDemo
                title="Controlled Markdown"
                description="Try table cells, checkboxes, Undo/Redo and source view. Merely switching views keeps the source unchanged. A real rich edit normalizes Markdown syntax."
                code={`const [value, setValue] = useState("# Notes");
<RichTextEditor label="Review notes" value={value} onChange={setValue} />`}
            >
                <div className="grid gap-6">
                    <Checkbox checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)}>
                        Read-only
                    </Checkbox>
                    <RichTextEditor label="Review notes" value={value} onChange={setValue} readOnly={readOnly} onSelectionChange={setSelection} />
                    <p role="status">
                        {selection && selection.value === value
                            ? `${selection.text.length} characters selected in ${selection.mode} view.`
                            : "Select a passage to inspect its context."}
                    </p>
                </div>
            </ComponentDemo>
            <ComponentDemo
                title="Unsupported content stays intact"
                description="Raw HTML and unrepresentable structures do not silently become different Markdown. Keep editing the exact source; rich view explains the restriction."
                code={`<RichTextEditor label="Imported document" value={source} onChange={setSource} />`}
            >
                <RichTextEditor label="Imported document" value={unsupported} onChange={setUnsupported} />
            </ComponentDemo>
            <section>
                <h2>Safety and images</h2>
                <p>
                    HTML paste is sanitized by DOMPurify and the editor schema. Only absolute HTTP(S) links/images and link-only mailto URLs are
                    accepted, without URL credentials. Plain text is never injected as HTML. Source text can retain unsupported content without
                    executing it.
                </p>
                <p>
                    Images are URL references, not uploads. Insert an image with alternative text, then explicitly choose Load image. Opening a
                    document does not request its remote images; opting in contacts the host and can disclose your IP address.
                </p>
                <h2>Selection and persistence</h2>
                <p>
                    Selection includes an exact Markdown snapshot. Source ranges use UTF-16 offsets; rich ranges use ProseMirror positions and must
                    not slice Markdown. Revalidate document identity, revision and snapshot before sending selected text to a model. Persistence and
                    revision authorization belong to the application.
                </p>
            </section>
        </DocsLayout>
    );
}
