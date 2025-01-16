"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useState } from "react";
import { Autocomplete, Card } from "../../../../../lib/src";

const options = [
  { value: "s", label: "Simple" },
  { value: "c", label: "Complex" },
  { value: "r", label: "Random" },
];

export default function FormPage() {
  const [value, setValue] = useState(options[0].value);
  const withHidden = options.map((x) => ({ ...x, hidden: value === x.value }));
  return (
    <DocsLayout
      title="Autocomplete"
      section="form"
      description="Multiple options with a beautiful search input."
    >
      <Card
        title="Brazilian masks"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Autocomplete
          required
          value={value}
          options={withHidden}
          title="Control option"
          onChange={(e) => setValue(e.target.value)}
        />
      </Card>
    </DocsLayout>
  );
}
