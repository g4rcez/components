"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Button, useNotification } from "../../../../../lib/src";

const themes = [
  "default",
  "info",
  "warn",
  "muted",
  "danger",
  "success",
  "secondary",
] as const;

export default function NotificationPage() {
  const notify = useNotification();

  return (
    <DocsLayout
      title="Notifications"
      section="display"
      description="A comprehensive toast notification system with themes, stacking, animations, and programmatic control."
    >
      <ComponentDemo
        title="Notification Themes"
        description="Trigger various notification themes to see their visual representation and behavior."
        code={`"use client";
import { Button, useNotification } from "@g4rcez/components";

const themes = [
  "default",
  "info",
  "warn",
  "muted",
  "danger",
  "success",
  "secondary",
] as const;

function NotificationThemesDemo() {
  const notify = useNotification();

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((theme) => (
        <Button
          key={theme}
          onClick={() =>
            notify(\`This is a \${theme} notification\`, {
              title: \`\${theme.charAt(0).toUpperCase() + theme.slice(1)} Notification\`,
              theme: theme,
            })
          }
        >
          Trigger {theme}
        </Button>
      ))}
    </div>
  );
}`}
      >
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <Button
              key={theme}
              onClick={() =>
                notify(`This is a ${theme} notification`, {
                  title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Notification`,
                  theme: theme,
                })
              }
            >
              Trigger {theme}
            </Button>
          ))}
        </div>
      </ComponentDemo>
    </DocsLayout>
  );
}
