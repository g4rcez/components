"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useEffect, useState } from "react";
import { Card, MultiSelect } from "../../../../../lib/src";

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

export default function MultiSelectPage() {
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
      <ComponentDemo
        title="Basic MultiSelect"
        description="A multi-select component demonstrating selection of multiple programming languages. The selected values are displayed below."
        code={`"use client";
import { useState, useEffect } from "react";
import { Card, MultiSelect } from "@g4rcez/components";

const defaults = [
  { label: "C#", value: "csharp" },
  { label: "Elixir", value: "elixir" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
];

function BasicMultiSelect() {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setOptions(defaults);
  }, []);

  return (
    <Card>
      <MultiSelect
        id="basic-multiselect"
        required
        options={options}
        title="Programming Languages"
        placeholder="Select your languages"
        onChangeOptions={setValue}
      />
      <div className="mt-4">
        <p>Selected: {JSON.stringify(value)}</p>
      </div>
    </Card>
  );
}`}
      >
        <Card
          title="Programming Languages"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <MultiSelect
            id="0"
            required
            options={withHidden}
            title="Control option"
            onChangeOptions={setValue}
            placeholder="Select your languages"
          />
        </Card>
        <div className="mt-4">
          <p>Selected: {JSON.stringify(value)}</p>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Empty MultiSelect"
        description="Demonstrates the multi-select component when no options are available."
        code={`"use client";
import { Card, MultiSelect } from "@g4rcez/components";

function EmptyMultiSelect() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Card>
      <MultiSelect
        id="empty-multiselect"
        required
        options={[]}
        title="Empty Options"
        onChangeOptions={setValue}
        placeholder="No options to select"
      />
    </Card>
  );
}`}
      >
        <Card
          title="Empty Options"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <MultiSelect
            id="empty"
            required
            options={[]}
            title="Control option"
            onChangeOptions={setValue}
            placeholder="No options to select"
          />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
