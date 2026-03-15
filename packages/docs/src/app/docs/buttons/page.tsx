"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Button, Card } from "../../../../../lib/src";

export default function Buttons() {
  return (
    <DocsLayout
      title="Buttons"
      section="display"
      description="The way users interact with your actions."
    >
      <ComponentDemo
        title="Button Themes"
        description="Demonstrates various button themes, including default, loading, and themed variants."
        code={`"use client";
import { Button } from "@g4rcez/components";

function ButtonThemes() {
  return (
    <div className="flex flex-wrap gap-8">
      <Button>Normal</Button>
      <Button loading>Loading</Button>
      <Button theme="danger">danger</Button>
      <Button theme="info">info</Button>
      <Button theme="neutral">neutral</Button>
      <Button theme="secondary">secondary</Button>
      <Button theme="success">success</Button>
      <Button theme="warn">warn</Button>
      <Button theme="muted">muted</Button>
    </div>
  );
}`}
      >
        <Card title="All button themes" className="flex flex-wrap gap-8">
          <Button>Normal</Button>
          <Button loading>Loading</Button>
          <Button theme="danger">danger</Button>
          <Button theme="info">info</Button>
          <Button theme="neutral">neutral</Button>
          <Button theme="secondary">secondary</Button>
          <Button theme="success">success</Button>
          <Button theme="warn">warn</Button>
          <Button theme="muted">muted</Button>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Small Buttons"
        description="Examples of small-sized buttons with different themes."
        code={`"use client";
import { Button } from "@g4rcez/components";

function SmallButtons() {
  return (
    <div className="flex flex-wrap gap-8">
      <Button size="small">Normal</Button>
      <Button size="small" theme="danger">danger</Button>
      <Button size="small" theme="info">info</Button>
      <Button size="small" theme="neutral">neutral</Button>
      <Button size="small" theme="secondary">secondary</Button>
      <Button size="small" theme="success">success</Button>
      <Button size="small" theme="muted">muted</Button>
      <Button size="small" theme="warn">warn</Button>
    </div>
  );
}`}
      >
        <Card title="Small buttons" className="flex flex-wrap gap-8">
          <Button size="small">Normal</Button>
          <Button size="small" theme="danger">
            danger
          </Button>
          <Button size="small" theme="info">
            info
          </Button>
          <Button size="small" theme="neutral">
            neutral
          </Button>
          <Button size="small" theme="secondary">
            secondary
          </Button>
          <Button size="small" theme="success">
            success
          </Button>
          <Button size="small" theme="muted">
            muted
          </Button>
          <Button size="small" theme="warn">
            warn
          </Button>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Minimal Buttons"
        description="Examples of minimal-sized buttons with different themes, ideal for compact interfaces."
        code={`"use client";
import { Button } from "@g4rcez/components";

function MinimalButtons() {
  return (
    <div className="flex flex-wrap gap-8">
      <Button size="min">Normal</Button>
      <Button size="min" theme="danger">danger</Button>
      <Button size="min" theme="info">info</Button>
      <Button size="min" theme="neutral">neutral</Button>
      <Button size="min" theme="secondary">secondary</Button>
      <Button size="min" theme="success">success</Button>
      <Button size="min" theme="warn">warn</Button>
    </div>
  );
}`}
      >
        <Card title="Minimal buttons" className="flex flex-wrap gap-8">
          <Button size="min">Normal</Button>
          <Button size="min" theme="danger">
            danger
          </Button>
          <Button size="min" theme="info">
            info
          </Button>
          <Button size="min" theme="neutral">
            neutral
          </Button>
          <Button size="min" theme="secondary">
            secondary
          </Button>
          <Button size="min" theme="success">
            success
          </Button>
          <Button size="min" theme="warn">
            warn
          </Button>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Ghost Buttons"
        description="Examples of 'ghost' style buttons with minimal background, using different themes."
        code={`"use client";
import { Button } from "@g4rcez/components";

function GhostButtons() {
  return (
    <div className="flex flex-wrap gap-8">
      <Button theme="ghost-primary" size="min">Normal</Button>
      <Button size="min" theme="ghost-danger">danger</Button>
      <Button size="min" theme="ghost-info">info</Button>
      <Button size="min" theme="ghost-secondary">secondary</Button>
      <Button size="min" theme="ghost-success">success</Button>
      <Button size="min" theme="ghost-warn">warn</Button>
      <Button size="min" theme="ghost-muted">muted</Button>
    </div>
  );
}`}
      >
        <Card title="Ghost buttons" className="flex flex-wrap gap-8">
          <Button theme="ghost-primary" size="min">Normal</Button>
          <Button size="min" theme="ghost-danger">
            danger
          </Button>
          <Button size="min" theme="ghost-info">
            info
          </Button>
          <Button size="min" theme="ghost-secondary">
            secondary
          </Button>
          <Button size="min" theme="ghost-success">
            success
          </Button>
          <Button size="min" theme="ghost-warn">
            warn
          </Button>
          <Button size="min" theme="ghost-muted">
            muted
          </Button>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
