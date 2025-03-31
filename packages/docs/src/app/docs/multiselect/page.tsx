"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useEffect, useState } from "react";
import { MultiSelect, Card, MultiSelectItemProps } from "../../../../../lib/src";

const defaults = [
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cpp" },
  { label: "Elixir", value: "elixir" },
  { label: "Go", value: "go" },
  { label: "Haskell", value: "haskell" },
  { label: "Java", value: "java" },
  { label: "JavaScript", value: "javascript" },
  { label: "Kotlin", value: "kotlin" },
  { label: "PHP", value: "php" },
  { label: "Python", value: "python" },
  { label: "Ruby", value: "ruby" },
  { label: "Rust", value: "rust" },
  { label: "Scala", value: "scala" },
  { label: "Swift", value: "swift" },
  { label: "TypeScript", value: "typescript" },
];

export default function FormPage() {
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState<string[]>([]);
  const withHidden = options.map((x) => ({ ...x, hidden: value === x.value }));

  useEffect(() => {
    setTimeout(() => setOptions(defaults), 0);
  }, []);

  return (
    <DocsLayout
      title="MultiSelect"
      section="form"
      description="Multiple options with a beautiful search input."
    >
      {JSON.stringify(value, null, 4)}
      <Card
        title="Brazilian masks"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <MultiSelect
          id="0"
          required
          options={withHidden}
          title="Control option"
          onChangeOptions={setValue}
        />
      </Card>
    </DocsLayout>
  );
}
