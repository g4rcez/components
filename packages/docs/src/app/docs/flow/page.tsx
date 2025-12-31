"use client";
import { DocsLayout } from "@/components/docs-layout";
import {
  AtomIcon,
  CodeIcon,
  KanbanIcon,
  ListChecksIcon,
  PocketKnifeIcon,
  UserIcon,
} from "lucide-react";
import { Autocomplete, Input, Card, Dict } from "../../../../../lib/src"; import { createGlobalReducer } from "use-typed-reducer";
import {
  type CreatableOpts,
  Flow,
  FlowItem,
} from "../../../../../lib/src/flow/flow";
import React from "react";

function Main() {
  const [state, dispatch] = useStore();
  const item = state.items[0]!;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch.update({ ...item, data: { ...item.data, value } });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="flex gap-1 items-center text-sm">
        <UserIcon />
        Me
      </p>
      <Input required title="Your name" onChange={onChange} />
    </div>
  );
}

const initialNodes: FlowItem[] = [
  {
    id: "main",
    type: "input",
    resizing: true,
    deletable: false,
    selectable: true,
    connectable: true,
    position: { x: 0, y: 0 },
    data: {
      id: "main",
      title: "You",
      type: "main",
      Item: Main,
    },
  },
];

const useStore = createGlobalReducer({ items: initialNodes }, (get) => ({
  update: (a: FlowItem) => {
    const state = get.state();
    const items = Dict.from(state.items, (x) => x.id);
    items.set(a.id, a);
    return { items: items.toArray() };
  },
  set: (a: FlowItem[]) => {
    const state = get.state();
    const items = Dict.from(state.items, (x) => x.id);
    a.map((x) => {
      const prev = items.get(x.data.id);
      items.set(x.data.id, { ...x, ...prev });
    });
    return { items: items.toArray() };
  },
}));

const taskOptions = [
  { label: "Development", value: "development" },
  { label: "Documentation", value: "docs" },
  { label: "Mentorship", value: "mentorship" },
];

const Task = (props: FlowItem) => {
  const [state, dispatch] = useStore();
  const item = state.items.find((x) => x.id === props.id)!;
  return (
    <div className="flex flex-col text-sm">
      <Autocomplete
        required
        name="name"
        options={taskOptions}
        title={props?.data.title ?? ""}
        onChange={(e) => {
          dispatch.update({
            ...item,
            ...props,
            data: {
              ...item.data,
              value: e.target.value,
            },
          });
        }}
      />
    </div>
  );
};

const parents: CreatableOpts[] = [
  {
    type: "concepts",
    id: "concepts",
    title: "Concepts",
    Item: Task,
    Icon: AtomIcon,
  },
  {
    type: "languages",
    id: "languages",
    title: "Coding",
    Item: Task,
    Icon: CodeIcon,
  },
  {
    type: "tasks",
    id: "tasks",
    Item: Task,
    title: "Tasks",
    Icon: ListChecksIcon,
  },
  {
    type: "tools",
    id: "tools",
    title: "Tools",
    Item: Task,
    Icon: PocketKnifeIcon,
  },
  {
    type: "methodologies",
    id: "methodologies",
    title: "Methodologies",
    Item: Task,
    Icon: KanbanIcon,
  },
];

export default function FlowPage() {
  const [state, dispatch] = useStore();
  return (
    <DocsLayout title="Flowcharts" section="display" description="???">
      <Card>
        <Flow
          theme="light"
          parents={parents}
          items={initialNodes}
          onChange={dispatch.set}
        />
      </Card>
      <pre>
        <code>{JSON.stringify(state.items, null, 4)}</code>
      </pre>
    </DocsLayout>
  );
}
