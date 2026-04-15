"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { CaretRightIcon, ClockIcon } from "@phosphor-icons/react";
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

export default function TimelinePage() {
  const [state, setState] = useState<Item | null>(null);

  return (
    <DocsLayout
      title="Timeline"
      section="Display"
      description="View items in sequence of events, like a chronological timeline."
    >
      <Modal
        type="drawer"
        title={state?.name}
        open={state !== null}
        onChange={() => setState(null)}
      >
        Ok
      </Modal>
      <ComponentDemo
        title="Basic Timeline with Details"
        description="A timeline displaying a list of events. Clicking 'See details' opens a modal with more information for that event."
        code={`"use client";
import { CaretRightIcon, ClockIcon } from "@phosphor-icons/react";
import { useState } from "react";
import {
  Button,
  Card,
  Timeline,
  Tag,
  TimelineItem,
  Modal,
} from "@g4rcez/components";

type Item = {
  name: string;
};

function BasicTimeline() {
  const [state, setState] = useState<Item | null>(null);

  return (
    <>
      <Modal
        type="drawer"
        title={state?.name}
        open={state !== null}
        onChange={() => setState(null)}
      >
        Event details for {state?.name}.
      </Modal>
      <Card title="Basic timeline">
        <Timeline>
          {Array.from({ length: 3 }).map((_, i) => { // Reduced length for demo clarity
            return (
              <TimelineItem key={i}>
                <TimelineItem.Icon
                  className={
                    i % 2 === 0 ? "bg-warn" : i % 3 === 0 ? "bg-info" : ""
                  }
                >
                  <ClockIcon />
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
                    onClick={() => setState({ name: \`Name \${i + 1}\` })}
                  >
                    See details <CaretRightIcon size={18} />
                  </Button>
                </TimelineItem.Right>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Card>
    </>
  );
}
`}
      >
        <Card title="Basic timeline">
          <Timeline>
            {Array.from({ length: 3 }).map((_, i) => {
              return (
                <TimelineItem key={i}>
                  <TimelineItem.Icon
                    className={
                      i % 2 === 0 ? "bg-warn" : i % 3 === 0 ? "bg-info" : ""
                    }
                  >
                    <ClockIcon />
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
                      See details <CaretRightIcon size={18} />
                    </Button>
                  </TimelineItem.Right>
                </TimelineItem>
              );
            })}
          </Timeline>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
