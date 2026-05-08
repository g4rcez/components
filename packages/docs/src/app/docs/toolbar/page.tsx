"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Button, Card, Toolbar } from "../../../../../lib/src";
import { TextBIcon, TextItalicIcon, TextUnderlineIcon, LinkIcon } from "@phosphor-icons/react";

export default function ToolbarPage() {
    return (
        <DocsLayout title="Toolbar" section="floating" description="A sticky bottom bar for contextual actions, animated with motion/react.">
            <ComponentDemo
                title="Basic Toolbar"
                description="Toolbar renders children in a sticky bottom-pinned container."
                code={`import { Button, Toolbar } from "@g4rcez/components";

function BasicToolbar() {
  return (
    <div className="relative h-32 border border-card-border rounded-lg overflow-hidden">
      <Toolbar>
        <Button theme="success">Save</Button>
        <Button theme="muted">Cancel</Button>
      </Toolbar>
    </div>
  );
}`}
            >
                <Card title="Basic">
                    <div className="relative h-32 overflow-hidden rounded-lg border border-card-border">
                        <Toolbar>
                            <Button theme="success">Save</Button>
                            <Button theme="muted">Cancel</Button>
                        </Toolbar>
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Rich Text Toolbar"
                description="Toolbar used for text formatting actions in an editor context."
                code={`import { Toolbar } from "@g4rcez/components";
import { TextBIcon, TextItalicIcon, TextUnderlineIcon, LinkIcon } from "@phosphor-icons/react";

function RichTextToolbar() {
  return (
    <div className="relative h-32 border border-card-border rounded-lg overflow-hidden">
      <Toolbar>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Bold" className="p-2 rounded hover:bg-muted">
            <TextBIcon size={16} />
          </button>
          <button type="button" aria-label="Italic" className="p-2 rounded hover:bg-muted">
            <TextItalicIcon size={16} />
          </button>
          <button type="button" aria-label="Underline" className="p-2 rounded hover:bg-muted">
            <TextUnderlineIcon size={16} />
          </button>
          <div className="w-px h-5 bg-card-border mx-1" aria-hidden="true" />
          <button type="button" aria-label="Insert link" className="p-2 rounded hover:bg-muted">
            <LinkIcon size={16} />
          </button>
        </div>
      </Toolbar>
    </div>
  );
}`}
            >
                <Card title="Rich text">
                    <div className="relative h-32 overflow-hidden rounded-lg border border-card-border">
                        <Toolbar>
                            <div className="flex items-center gap-2">
                                <button type="button" aria-label="Bold" className="rounded p-2 hover:bg-muted">
                                    <TextBIcon size={16} />
                                </button>
                                <button type="button" aria-label="Italic" className="rounded p-2 hover:bg-muted">
                                    <TextItalicIcon size={16} />
                                </button>
                                <button type="button" aria-label="Underline" className="rounded p-2 hover:bg-muted">
                                    <TextUnderlineIcon size={16} />
                                </button>
                                <div className="mx-1 h-5 w-px bg-card-border" aria-hidden="true" />
                                <button type="button" aria-label="Insert link" className="rounded p-2 hover:bg-muted">
                                    <LinkIcon size={16} />
                                </button>
                            </div>
                        </Toolbar>
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Selection Toolbar"
                description="Toolbar that appears when rows are selected, providing bulk action buttons."
                code={`import { Button, Toolbar } from "@g4rcez/components";

function SelectionToolbar() {
  return (
    <div className="relative h-32 border border-card-border rounded-lg overflow-hidden">
      <Toolbar>
        <div className="flex items-center gap-4">
          <span className="text-sm text-secondary">3 items selected</span>
          <Button theme="danger" size="small">Delete</Button>
          <Button theme="secondary" size="small">Export</Button>
        </div>
      </Toolbar>
    </div>
  );
}`}
            >
                <Card title="Selection">
                    <div className="relative h-32 overflow-hidden rounded-lg border border-card-border">
                        <Toolbar>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-secondary">3 items selected</span>
                                <Button theme="danger" size="small">
                                    Delete
                                </Button>
                                <Button theme="secondary" size="small">
                                    Export
                                </Button>
                            </div>
                        </Toolbar>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
