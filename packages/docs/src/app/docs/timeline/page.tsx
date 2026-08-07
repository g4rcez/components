"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { CalendarDotsIcon, CaretRightIcon, CheckCircleIcon, RocketLaunchIcon } from "@phosphor-icons/react";
import { Button, Card, Modal, Tag, Timeline, TimelineItem } from "@g4rcez/components";
import { useState } from "react";

const events = [
    {
        id: "release",
        title: "Version 6.0 published",
        description: "The new component styles, design tokens, and migration tools are now available.",
        date: "Aug 7, 2026 · 1:17 PM",
        dateTime: "2026-08-07T13:17:00-03:00",
        status: "Released",
        indicator: "success",
        category: "Release",
        icon: RocketLaunchIcon,
        iconClassName: "bg-success",
    },
    {
        id: "review",
        title: "Documentation review completed",
        description: "Component examples and API references passed the final content review.",
        date: "Aug 7, 2026 · 11:42 AM",
        dateTime: "2026-08-07T11:42:00-03:00",
        status: "Reviewed",
        indicator: "info",
        category: "Documentation",
        icon: CheckCircleIcon,
        iconClassName: "bg-info",
    },
    {
        id: "migration",
        title: "Migration guide scheduled",
        description: "The upgrade guide is ready and will be published with the next documentation update.",
        date: "Aug 7, 2026 · 9:05 AM",
        dateTime: "2026-08-07T09:05:00-03:00",
        status: "Scheduled",
        indicator: "warn",
        category: "Guide",
        icon: CalendarDotsIcon,
        iconClassName: "bg-warn",
    },
] as const;

type TimelineEvent = (typeof events)[number];

export default function TimelinePage() {
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

    return (
        <DocsLayout
            title="Timeline"
            section="Display"
            description="View related events in chronological order with clear status and supporting details."
        >
            <Modal
                type="drawer"
                title={selectedEvent?.title}
                open={selectedEvent !== null}
                onChange={(open) => {
                    if (!open) setSelectedEvent(null);
                }}
            >
                {selectedEvent && (
                    <div className="space-y-6">
                        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{selectedEvent.description}</p>
                        <dl className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-1">
                                <dt className="text-xs font-medium text-muted-foreground">Status</dt>
                                <dd>
                                    <Tag size="small" theme="neutral" indicator={selectedEvent.indicator}>
                                        {selectedEvent.status}
                                    </Tag>
                                </dd>
                            </div>
                            <div className="space-y-1">
                                <dt className="text-xs font-medium text-muted-foreground">Category</dt>
                                <dd className="text-sm font-medium text-foreground">{selectedEvent.category}</dd>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <dt className="text-xs font-medium text-muted-foreground">Published</dt>
                                <dd className="text-sm font-medium text-foreground">
                                    <time dateTime={selectedEvent.dateTime}>{selectedEvent.date}</time>
                                </dd>
                            </div>
                        </dl>
                    </div>
                )}
            </Modal>
            <ComponentDemo
                title="Release Activity Timeline"
                description="A compact activity feed with status labels, supporting context, and an action that opens details for each event."
                code={`"use client";
import {
  CalendarDotsIcon,
  CaretRightIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react";
import {
  Button,
  Card,
  Modal,
  Tag,
  Timeline,
  TimelineItem,
} from "@g4rcez/components";
import { useState } from "react";

const events = [
  {
    id: "release",
    title: "Version 6.0 published",
    description:
      "The new component styles, design tokens, and migration tools are now available.",
    date: "Aug 7, 2026 · 1:17 PM",
    dateTime: "2026-08-07T13:17:00-03:00",
    status: "Released",
    indicator: "success",
    category: "Release",
    icon: RocketLaunchIcon,
    iconClassName: "bg-success",
  },
  {
    id: "review",
    title: "Documentation review completed",
    description:
      "Component examples and API references passed the final content review.",
    date: "Aug 7, 2026 · 11:42 AM",
    dateTime: "2026-08-07T11:42:00-03:00",
    status: "Reviewed",
    indicator: "info",
    category: "Documentation",
    icon: CheckCircleIcon,
    iconClassName: "bg-info",
  },
  {
    id: "migration",
    title: "Migration guide scheduled",
    description:
      "The upgrade guide is ready and will be published with the next documentation update.",
    date: "Aug 7, 2026 · 9:05 AM",
    dateTime: "2026-08-07T09:05:00-03:00",
    status: "Scheduled",
    indicator: "warn",
    category: "Guide",
    icon: CalendarDotsIcon,
    iconClassName: "bg-warn",
  },
] as const;

type TimelineEvent = (typeof events)[number];

function ReleaseActivityTimeline() {
  const [selectedEvent, setSelectedEvent] =
    useState<TimelineEvent | null>(null);

  return (
    <>
      <Modal
        type="drawer"
        title={selectedEvent?.title}
        open={selectedEvent !== null}
        onChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      >
        {selectedEvent && (
          <div className="space-y-6">
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              {selectedEvent.description}
            </p>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs font-medium text-muted-foreground">
                  Status
                </dt>
                <dd>
                  <Tag
                    size="small"
                    theme="neutral"
                    indicator={selectedEvent.indicator}
                  >
                    {selectedEvent.status}
                  </Tag>
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium text-muted-foreground">
                  Category
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {selectedEvent.category}
                </dd>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground">
                  Published
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  <time dateTime={selectedEvent.dateTime}>
                    {selectedEvent.date}
                  </time>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
      <Card title="Release activity" container="w-full max-w-4xl">
        <Timeline>
          {events.map((event) => {
            const EventIcon = event.icon;

            return (
              <TimelineItem key={event.id}>
                <TimelineItem.Icon className={event.iconClassName}>
                  <EventIcon size={20} aria-hidden />
                </TimelineItem.Icon>
                <TimelineItem.Body className="flex flex-col gap-3 pb-1">
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold tracking-tight text-foreground">
                      {event.title}
                    </h4>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag
                      size="tiny"
                      theme="neutral"
                      indicator={event.indicator}
                    >
                      {event.status}
                    </Tag>
                    <Tag size="tiny" theme="muted">
                      {event.category}
                    </Tag>
                    <time
                      dateTime={event.dateTime}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {event.date}
                    </time>
                    <Button
                      theme="raw"
                      className="ml-auto whitespace-nowrap text-sm text-secondary"
                      aria-label={\`View details for \${event.title}\`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      Details <CaretRightIcon size={16} aria-hidden />
                    </Button>
                  </div>
                </TimelineItem.Body>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Card>
    </>
  );
}`}
            >
                <Card title="Release activity" container="w-full max-w-4xl">
                    <Timeline>
                        {events.map((event) => {
                            const EventIcon = event.icon;

                            return (
                                <TimelineItem key={event.id}>
                                    <TimelineItem.Icon className={event.iconClassName}>
                                        <EventIcon size={20} aria-hidden />
                                    </TimelineItem.Icon>
                                    <TimelineItem.Body className="flex flex-col gap-3 pb-1">
                                        <div className="space-y-1">
                                            <h4 className="text-base font-semibold tracking-tight text-foreground">{event.title}</h4>
                                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Tag size="tiny" theme="neutral" indicator={event.indicator}>
                                                {event.status}
                                            </Tag>
                                            <Tag size="tiny" theme="muted">
                                                {event.category}
                                            </Tag>
                                            <time dateTime={event.dateTime} className="text-xs font-medium text-muted-foreground">
                                                {event.date}
                                            </time>
                                            <Button
                                                theme="raw"
                                                className="ml-auto whitespace-nowrap text-sm text-secondary"
                                                aria-label={`View details for ${event.title}`}
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                Details <CaretRightIcon size={16} aria-hidden />
                                            </Button>
                                        </div>
                                    </TimelineItem.Body>
                                </TimelineItem>
                            );
                        })}
                    </Timeline>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
