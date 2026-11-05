"use client";
import { useEffect, useState } from "react";
import { Button, Checkbox } from "@g4rcez/components";
import {
    DrawingEditor,
    createDrawingScene,
    deserializeDrawingScene,
    serializeDrawingScene,
    type DrawingScene,
} from "@g4rcez/components/drawing-editor";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";

export default function DrawingEditorPage() {
    const [scene, setScene] = useState<DrawingScene>(() => ({ ...createDrawingScene(800, 500), background: "#ffffff" }));
    const [saved, setSaved] = useState("");
    const [png, setPng] = useState("");
    const [readOnly, setReadOnly] = useState(false);
    useEffect(
        () => () => {
            if (png) URL.revokeObjectURL(png);
        },
        [png]
    );
    return (
        <DocsLayout
            title="DrawingEditor"
            section="form"
            description="Draw, transform and persist a controlled layered scene; export real flattened PNG bytes."
        >
            <ComponentDemo
                title="Layered drawing"
                description="Add text or shapes, draw with pencil, select and transform layers, then save/resume the JSON scene. This example saves in this mounted page only—not on a server."
                code={`const [scene, setScene] = useState(() => createDrawingScene(800, 500));
<DrawingEditor label="Example drawing" value={scene} onChange={setScene}
  onExport={async png => { await uploadPng(png); }} />`}
            >
                <div className="grid w-full gap-4">
                    <Checkbox checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)}>
                        Read-only preview
                    </Checkbox>
                    <DrawingEditor
                        label="Example drawing"
                        value={scene}
                        onChange={setScene}
                        readOnly={readOnly}
                        onExport={(blob) => setPng(URL.createObjectURL(blob))}
                    />
                    <div className="flex flex-wrap gap-3">
                        <Button theme="neutral" disabled={readOnly} onClick={() => setSaved(serializeDrawingScene(scene))}>
                            Save example scene
                        </Button>
                        <Button theme="neutral" disabled={!saved || readOnly} onClick={() => setScene(deserializeDrawingScene(saved))}>
                            Resume example scene
                        </Button>
                        {png && (
                            <Button as="a" href={png} download="drawing-example.png">
                                Download PNG
                            </Button>
                        )}
                    </div>
                    {saved && (
                        <p role="status">Example JSON saved ({new TextEncoder().encode(saved).byteLength} bytes). Reloading this page clears it.</p>
                    )}
                    {png && <img src={png} alt="Flattened example drawing" width={800} height={500} className="h-auto max-w-full" />}
                </div>
            </ComponentDemo>
            <section>
                <h2>Integration and accessibility</h2>
                <p>
                    Persist the scene with an optimistic revision and source hash. Upload PNG separately, await success, then attach its durable
                    reference to your record. The imperative ref also exposes exportPng and focus. Keyboard layer controls, transform fields and
                    rectangular selection fields accompany pointer gestures. Read-only prevents mutation but retains export.
                </p>
                <p>
                    Load drawing-editor.css and its style-manifest dependency closure. The source-image asset is resolved by the host rather than
                    copied into every scene/history snapshot. See the canonical drawing-editor reference for limits and all public types.
                </p>
            </section>
        </DocsLayout>
    );
}
