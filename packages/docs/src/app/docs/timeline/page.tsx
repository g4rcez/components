"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Card } from "../../../../../lib/src";
import {
  Timeline,
  TimelineItemProps,
} from "../../../../../lib/src/components/display/timeline";

const activity: TimelineItemProps[] = [
  {
    id: "094594ce-47e5-41bd-b3d8-17d975bca71f",
    avatar: { name: "Ciclano Moreira" },
    type: "tag",
    date: new Date(1990, 0, 1),
    text: "Quisque ut dolor gravida, placerat libero vel, euismod. Nec dubitamus multa iter quae et nos invenerat.",
  },
  {
    id: "094594ce-47e5-41bd-b3d8-17d975bca71f",
    avatar: { name: "Ciclano Moreira" },
    type: "record",
    date: new Date(1990, 0, 1),
    text: "Quisque ut dolor gravida, placerat libero vel, euismod. Nec dubitamus multa iter quae et nos invenerat.",
  },
  {
    id: "4d027781-64ad-41be-aff8-6adbe87879d8",
    avatar: { name: "Fulano Silva" },
    type: "record",
    date: new Date(1970, 0, 1),
  },
];

export default function Example() {
  return (
    <DocsLayout
      title="Timeline"
      section="Display"
      description="View items in sequence of the events, like a timeline."
    >
      <Card title="Basic timeline">
        <Timeline items={activity} />
      </Card>
    </DocsLayout>
  );
}
