"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Button, Toolbar } from "@g4rcez/components";
import { TextBIcon, TextItalicIcon, TextUnderlineIcon, LinkIcon } from "@phosphor-icons/react";

export default function ToolbarPage() {
    return (
        <DocsLayout title="Toolbar" section="floating" description="Connected actions in a shared, sticky toolbar surface.">
            <ComponentDemo
                title="Basic Toolbar"
                description="Place buttons directly inside Toolbar. Adjacent edges are square; only the ends are rounded."
                code={`import { Button, Toolbar } from "@g4rcez/components";

<Toolbar aria-label="Document actions">
  <Button theme="ghost-neutral" size="small">File</Button>
  <Button theme="ghost-neutral" size="small">Edit</Button>
  <Button theme="ghost-neutral" size="small">View</Button>
  <Button theme="ghost-neutral" size="small">Help</Button>
</Toolbar>`}
            >
                <Toolbar aria-label="Document actions">
                    <Button theme="ghost-neutral" size="small">
                        File
                    </Button>
                    <Button theme="ghost-neutral" size="small">
                        Edit
                    </Button>
                    <Button theme="ghost-neutral" size="small">
                        View
                    </Button>
                    <Button theme="ghost-neutral" size="small">
                        Help
                    </Button>
                </Toolbar>
            </ComponentDemo>
            <ComponentDemo
                title="Rich Text Toolbar"
                description="Icon buttons share the same connected layout. Give each control an accessible name."
                code={`import { Button, Toolbar } from "@g4rcez/components";
import { TextBIcon, TextItalicIcon, TextUnderlineIcon, LinkIcon } from "@phosphor-icons/react";

<Toolbar aria-label="Text formatting">
  <Button theme="ghost-neutral" size="icon" aria-label="Bold"><TextBIcon /></Button>
  <Button theme="ghost-neutral" size="icon" aria-label="Italic"><TextItalicIcon /></Button>
  <Button theme="ghost-neutral" size="icon" aria-label="Underline"><TextUnderlineIcon /></Button>
  <Button theme="ghost-neutral" size="icon" aria-label="Insert link"><LinkIcon /></Button>
</Toolbar>`}
            >
                <Toolbar aria-label="Text formatting">
                    <Button theme="ghost-neutral" size="icon" aria-label="Bold">
                        <TextBIcon />
                    </Button>
                    <Button theme="ghost-neutral" size="icon" aria-label="Italic">
                        <TextItalicIcon />
                    </Button>
                    <Button theme="ghost-neutral" size="icon" aria-label="Underline">
                        <TextUnderlineIcon />
                    </Button>
                    <Button theme="ghost-neutral" size="icon" aria-label="Insert link">
                        <LinkIcon />
                    </Button>
                </Toolbar>
            </ComponentDemo>
            <ComponentDemo
                title="Selection Toolbar"
                description="Button themes and disabled states are preserved within the connected group."
                code={`import { Button, Toolbar } from "@g4rcez/components";

<Toolbar aria-label="Selection actions">
  <Button theme="danger" size="small">Delete</Button>
  <Button theme="secondary" size="small">Export</Button>
  <Button theme="muted" size="small" disabled>Archive</Button>
</Toolbar>`}
            >
                <Toolbar aria-label="Selection actions">
                    <Button theme="danger" size="small">
                        Delete
                    </Button>
                    <Button theme="secondary" size="small">
                        Export
                    </Button>
                    <Button theme="muted" size="small" disabled>
                        Archive
                    </Button>
                </Toolbar>
            </ComponentDemo>
        </DocsLayout>
    );
}
