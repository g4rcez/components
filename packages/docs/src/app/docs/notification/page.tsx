"use client";
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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
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
    </div>
  );
}
