"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React from "react";
import { RenderOnView } from "../../../../../lib/src";

export default function RenderOnViewPage() {
  return (
    <DocsLayout
      title="Render on View"
      section="Utilities"
      description="Defer rendering of components until they enter the viewport for performance optimization."
    >
      <ComponentDemo
        title="Basic RenderOnView"
        description="Scroll down to see the 'TESTING' text appear. An alert will trigger when the component becomes visible."
        code={`"use client";
import { RenderOnView } from "@g4rcez/components";

function BasicRenderOnView() {
  return (
    <div>
      <div style={{ 
        height: "1000px", 
        background: "linear-gradient(to bottom, hsla(0, 0%, 94%), hsla(0, 0%, 88%))" 
      }}>
        Scroll down to see the component
      </div>
      <RenderOnView onIntersection={() => alert("Component is now visible!")}>
        <span className="text-xl font-bold text-primary">TESTANDO</span>
      </RenderOnView>
      <div style={{ 
        height: "1000px", 
        background: "linear-gradient(to bottom, hsla(0, 0%, 88%), hsla(0, 0%, 94%))" 
      }}>
        End of page
      </div>
    </div>
  );
}`}
      >
        <div
          style={{
            height: "1000px",
            background:
              "linear-gradient(to bottom, hsla(0, 0%, 94%), hsla(0, 0%, 88%))",
          }}
          className="flex items-center justify-center text-xl text-muted-foreground"
        >
          Scroll down to see the component
        </div>
        <RenderOnView onIntersection={() => alert("Component is now visible!")}>
          <span className="text-xl font-black uppercase tracking-widest text-primary">
            🎉 Component Activated
          </span>
        </RenderOnView>
        <div
          style={{
            height: "1000px",
            background:
              "linear-gradient(to bottom, hsla(0, 0%, 88%), hsla(0, 0%, 94%))",
          }}
          className="flex items-center justify-center text-xl text-muted-foreground"
        >
          End of page
        </div>
      </ComponentDemo>
    </DocsLayout>
  );
}
