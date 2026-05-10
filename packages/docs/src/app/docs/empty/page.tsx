"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Empty } from "../../../../../lib/src";
import { ArchiveIcon, UsersIcon } from "@phosphor-icons/react";

export default function EmptyPage() {
    return (
        <DocsLayout title="Empty" section="display" description="A placeholder component for empty states, showing an icon and a message.">
            <ComponentDemo
                title="Default Empty State"
                description="Without props, renders the default FileIcon and the translated empty data message."
                code={`import { Empty } from "@g4rcez/components";

function DefaultEmpty() {
  return <Empty />;
}`}
            >
                <Card title="Default">
                    <Empty />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Custom Icon"
                description="Pass any Phosphor icon via the Icon prop to match the empty state context."
                code={`import { Empty } from "@g4rcez/components";
import { ArchiveIcon, UsersIcon } from "@phosphor-icons/react";

function CustomIcons() {
  return (
    <div className="flex flex-col gap-4">
      <Empty Icon={ArchiveIcon} message="No archived items" />
      <Empty Icon={UsersIcon} message="No team members yet" />
    </div>
  );
}`}
            >
                <Card title="Custom icons">
                    <div className="flex flex-col gap-4">
                        <Empty Icon={ArchiveIcon} message="No archived items" />
                        <Empty Icon={UsersIcon} message="No team members yet" />
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Custom Message"
                description="The message prop overrides the default translated string."
                code={`import { Empty } from "@g4rcez/components";

function CustomMessage() {
  return (
    <Empty message="Your search returned no results. Try a different keyword." />
  );
}`}
            >
                <Card title="Custom message">
                    <Empty message="Your search returned no results. Try a different keyword." />
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
