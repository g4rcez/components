"use client";

import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { ArchiveIcon, CheckIcon, CheckCircleIcon, TrashIcon } from "@phosphor-icons/react";
import { SwipeableList, type SwipeableListItem } from "@g4rcez/components";
import { useState } from "react";

const items: SwipeableListItem[] = [
    {
        id: "pull-request",
        leading: <CheckCircleIcon size={24} aria-hidden />,
        title: "Review pull request",
        description: "Update the component docs before lunch",
        meta: "Today",
        leftActions: [
            {
                id: "complete",
                label: "Complete",
                icon: <CheckIcon size={20} aria-hidden />,
                tone: "success",
            },
        ],
        rightActions: [
            {
                id: "archive",
                label: "Archive",
                icon: <ArchiveIcon size={20} aria-hidden />,
            },
            {
                id: "delete",
                label: "Delete",
                icon: <TrashIcon size={20} aria-hidden />,
                tone: "danger",
            },
        ],
    },
    {
        id: "sprint",
        leading: <CheckCircleIcon size={24} aria-hidden />,
        title: "Plan next sprint",
        description: "Prepare the team backlog for tomorrow",
        meta: "Tomorrow",
        rightActions: [
            {
                id: "delete",
                label: "Delete",
                icon: <TrashIcon size={20} aria-hidden />,
                tone: "danger",
            },
        ],
    },
];

export default function SwipeableListPage() {
    const [lastAction, setLastAction] = useState("Swipe a row to reveal its actions.");

    return (
        <DocsLayout
            title="SwipeableList"
            section="display"
            description="A window-virtualized list that reveals contextual actions by swiping rows on touch and pointer devices."
        >
            <ComponentDemo
                title="Swipe actions"
                description="Swipe right to reveal actions on the left, or swipe left to reveal actions on the right. Rows are virtualized with react-virtuoso, and revealed actions remain keyboard accessible."
                code={`"use client";
import { useState } from "react";
import { ArchiveIcon, CheckIcon, CheckCircleIcon, TrashIcon } from "@phosphor-icons/react";
import { SwipeableList, type SwipeableListItem } from "@g4rcez/components";

const items: SwipeableListItem[] = [
  {
    id: "pull-request",
    leading: <CheckCircleIcon size={24} aria-hidden />,
    title: "Review pull request",
    description: "Update the component docs before lunch",
    meta: "Today",
    leftActions: [
      {
        id: "complete",
        label: "Complete",
        icon: <CheckIcon size={20} aria-hidden />,
        tone: "success",
      },
    ],
    rightActions: [
      {
        id: "archive",
        label: "Archive",
        icon: <ArchiveIcon size={20} aria-hidden />,
      },
      {
        id: "delete",
        label: "Delete",
        icon: <TrashIcon size={20} aria-hidden />,
        tone: "danger",
      },
    ],
  },
];

export function InboxList() {
  const [lastAction, setLastAction] = useState("Swipe a row to reveal its actions.");

  return (
    <div className="space-y-4">
      <SwipeableList
        className="gap-4"
        items={items}
        onAction={({ action, side }) => {
          setLastAction(\`\${action.id} action selected from the \${side} side.\`);
        }}
      />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {lastAction}
      </p>
    </div>
  );
}`}
            >
                <div className="w-full max-w-xl space-y-4">
                    <SwipeableList
                        className="gap-4"
                        items={items}
                        onAction={({ action, side }) => {
                            setLastAction(`${action.id} action selected from the ${side} side.`);
                        }}
                    />
                    <p aria-live="polite" className="text-sm text-muted-foreground">
                        {lastAction}
                    </p>
                </div>
            </ComponentDemo>
        </DocsLayout>
    );
}
