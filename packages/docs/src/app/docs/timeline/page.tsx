"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ChevronRightIcon, Clock7Icon } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Card,
  Timeline,
  Tag,
  TimelineItem,
  Modal,
} from "../../../../../lib/src";

type Item = {
  name: string;
};

export default function Example() {
  const [state, setState] = useState<Item | null>(null);

  return (
    <DocsLayout
      title="Timeline"
      section="Display"
      description="View items in sequence of the events, like a timeline."
    >
      <Modal
        type="drawer"
        title={state?.name}
        open={state !== null}
        onChange={() => setState(null)}
      >
        Ok
      </Modal>
      <Card title="Basic timeline">
        <Timeline>
          {Array.from({ length: 100 }).map((_, i) => {
            return (
              <TimelineItem key={i}>
                <TimelineItem.Icon
                  className={
                    i % 2 === 0 ? "bg-warn" : i % 3 === 0 ? "bg-info" : ""
                  }
                >
                  <Clock7Icon />
                </TimelineItem.Icon>
                <TimelineItem.Body className="flex flex-col gap-2">
                  <span className="flex flex-col gap-1">
                    <time className="text-sm">
                      {new Date().toLocaleDateString("pt-BR", {
                        hour: "numeric",
                        minute: "numeric",
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <p className="text-xl leading-relaxed tracking-wide font-medium">
                      {i + 1}. Title
                    </p>
                  </span>
                  <div className="flex items-center gap-4">
                    <Tag indicator="info" theme="neutral" size="small">
                      Tag 1
                    </Tag>
                    <Tag indicator="danger" theme="neutral" size="small">
                      Tag 2
                    </Tag>
                    <Tag indicator="warn" theme="neutral" size="small">
                      Tag 3
                    </Tag>
                  </div>
                </TimelineItem.Body>
                <TimelineItem.Right>
                  <Button
                    theme="raw"
                    className="text-sm text-secondary"
                    onClick={() => setState({ name: `Name ${i + 1}` })}
                  >
                    See details <ChevronRightIcon size={18} />
                  </Button>
                </TimelineItem.Right>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Card>
    </DocsLayout>
  );
}
