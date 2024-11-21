"use client";
import { DocsLayout } from "@/components/docs-layout";
import React from "react";
import { RenderOnView } from "../../../../../lib/src";

export default function RenderOnViewPage() {
  return (
    <DocsLayout
      title="Render on View"
      section="Utilities"
      description="Avoid components to render on enter at page. Defer the rendering only when the element appears at page."
    >
      <div style={{ height: "10000px" }} className="h-screen bg-black w-full" />
      <RenderOnView onIntersection={() => alert(1)}>
        <span>TESTANDO</span>
      </RenderOnView>
    </DocsLayout>
  );
}
