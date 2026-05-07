"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Card, TransferList } from "../../../../../lib/src";

type User = { id: string; name: string; email: string };

const ALL_USERS: User[] = [
  { id: "1", name: "Alice Martin", email: "alice@example.com" },
  { id: "2", name: "Bob Chen", email: "bob@example.com" },
  { id: "3", name: "Carol Davis", email: "carol@example.com" },
  { id: "4", name: "Dan Kim", email: "dan@example.com" },
];

const UserItem = ({ data }: { data: User }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{data.name}</span>
    <span className="text-xs text-secondary">{data.email}</span>
  </div>
);

export default function TransferListPage() {
  const [source, setSource] = useState<User[]>(ALL_USERS);
  const [target, setTarget] = useState<User[]>([]);

  return (
    <DocsLayout
      title="TransferList"
      section="form"
      description="A two-panel list component for moving items between source and target collections, with virtualized rendering."
    >
      <ComponentDemo
        title="Basic Transfer List"
        description="Provide source, target, setSource, setTarget, an Item renderer, and the reference key."
        code={`"use client";
import { useState } from "react";
import { TransferList } from "@g4rcez/components";

type User = { id: string; name: string; email: string };

const USERS: User[] = [
  { id: "1", name: "Alice Martin", email: "alice@example.com" },
  { id: "2", name: "Bob Chen", email: "bob@example.com" },
  { id: "3", name: "Carol Davis", email: "carol@example.com" },
];

const UserItem = ({ data }: { data: User }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{data.name}</span>
    <span className="text-xs text-secondary">{data.email}</span>
  </div>
);

function BasicTransferList() {
  const [source, setSource] = useState<User[]>(USERS);
  const [target, setTarget] = useState<User[]>([]);
  return (
    <TransferList
      source={source}
      target={target}
      setSource={setSource}
      setTarget={setTarget}
      reference="id"
      Item={UserItem}
    />
  );
}`}
      >
        <Card title="Basic">
          <TransferList
            source={source}
            target={target}
            setSource={setSource}
            setTarget={setTarget}
            reference="id"
            Item={UserItem}
          />
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Pre-populated Target"
        description="Pass items in target to start with some already moved to the right panel."
        code={`"use client";
import { useState } from "react";
import { TransferList } from "@g4rcez/components";

type User = { id: string; name: string };

const UserItem = ({ data }: { data: User }) => <span>{data.name}</span>;

function PrePopulatedTransferList() {
  const [source, setSource] = useState([
    { id: "3", name: "Carol Davis" },
    { id: "4", name: "Dan Kim" },
  ]);
  const [target, setTarget] = useState([
    { id: "1", name: "Alice Martin" },
    { id: "2", name: "Bob Chen" },
  ]);
  return (
    <TransferList
      source={source}
      target={target}
      setSource={setSource}
      setTarget={setTarget}
      reference="id"
      Item={UserItem}
    />
  );
}`}
      >
        <Card title="Pre-populated">
          <TransferList
            source={[
              { id: "3", name: "Carol Davis", email: "carol@example.com" },
              { id: "4", name: "Dan Kim", email: "dan@example.com" },
            ]}
            target={[
              { id: "1", name: "Alice Martin", email: "alice@example.com" },
              { id: "2", name: "Bob Chen", email: "bob@example.com" },
            ]}
            setSource={() => {}}
            setTarget={() => {}}
            reference="id"
            Item={UserItem}
          />
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Empty Source"
        description="When source is empty the left panel renders an empty state."
        code={`"use client";
import { useState } from "react";
import { TransferList } from "@g4rcez/components";

type Tag = { id: string; name: string };
const TagItem = ({ data }: { data: Tag }) => <span>{data.name}</span>;

function EmptySource() {
  const [source, setSource] = useState<Tag[]>([]);
  const [target, setTarget] = useState<Tag[]>([
    { id: "a", name: "frontend" },
    { id: "b", name: "backend" },
    { id: "c", name: "design" },
  ]);
  return (
    <TransferList
      source={source}
      target={target}
      setSource={setSource}
      setTarget={setTarget}
      reference="id"
      Item={TagItem}
    />
  );
}`}
      >
        <Card title="Empty source">
          <TransferList
            source={[]}
            target={[
              { id: "a", name: "frontend", email: "" },
              { id: "b", name: "backend", email: "" },
              { id: "c", name: "design", email: "" },
            ]}
            setSource={() => {}}
            setTarget={() => {}}
            reference="id"
            Item={UserItem}
          />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
