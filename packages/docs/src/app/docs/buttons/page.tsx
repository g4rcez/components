"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Button, Card } from "../../../../../lib/src";

export default function Buttons() {
  return (
    <DocsLayout
      title="Buttons"
      section="display"
      description="The way to user interact with your actions"
    >
      <div className="flex flex-col gap-8">
        <Card title="All button themes" className="flex flex-wrap gap-8">
          <Button>Normal</Button>
          <Button theme="danger">danger</Button>
          <Button theme="info">info</Button>
          <Button theme="neutral">neutral</Button>
          <Button theme="secondary">secondary</Button>
          <Button theme="success">success</Button>
          <Button theme="warn">warn</Button>
        </Card>
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
          <Button size="small" theme="warn">
            warn
          </Button>
        </Card>
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
        </Card>
      </div>
    </DocsLayout>
  );
}
