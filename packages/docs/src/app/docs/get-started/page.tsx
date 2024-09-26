"use client";
import { DocsLayout } from "@/components/docs-layout";
import { useEffect, useRef } from "react";
import { Button } from "../../../../../lib/src";
import { useNotification } from "../../../../../lib/src/components/display/notifications";

export default function GetStartedPage() {
  const notification = useNotification();
  const count = useRef(0);

  useEffect(() => {
    const fns = [
      notification(
        <p>
          Hack the <b>PLANET</b>
        </p>,
        { title: "Title", theme: "warn" },
      ),
    ];
    return () => void fns.map((x) => x.close());
  }, []);

  return (
    <DocsLayout
      title="Get started"
      section="start"
      description="Your first steps"
    >
      <h2 className="text-2xl font-medium leading-relaxed mb-4">
        How to install?
      </h2>
      <pre className="font-mono text-sm p-4 border border-card-border rounded-lg">
        <code>npm install -g @g4rcez/components</code>
      </pre>
      <Button
        onClick={() => {
          const prev = count.current;
          const c = prev + 1;
          count.current = c;
          notification(`I'm a ${c} index`, {
            duration: 20000,
          });
        }}
      >
        Notify
      </Button>
    </DocsLayout>
  );
}
