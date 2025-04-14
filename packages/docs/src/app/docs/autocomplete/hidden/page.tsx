"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useState } from "react";
import {
  Autocomplete,
  AutocompleteItemProps,
  Card,
} from "../../../../../../lib/src";

const options = [
  { value: "1", label: "JavaScript" },
  { value: "2", label: "Python" },
  { value: "3", label: "Java" },
  { value: "4", label: "C#" },
  { value: "5", label: "C++" },
  { value: "6", label: "Ruby" },
  { value: "7", label: "Go" },
  { value: "8", label: "Swift" },
  { value: "9", label: "TypeScript" },
  { value: "10", label: "PHP" },
  { value: "11", label: "Kotlin" },
  { value: "12", label: "Rust" },
  { value: "13", label: "Scala" },
  { value: "14", label: "Perl" },
  { value: "15", label: "Haskell" },
];

export default function AutocompleteWithHidden() {
  const [state, setState] = useState<string[]>([]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState((prev) => {
      if (prev.includes(e.target.value)) return prev.filter((x) => x !== value);
      return [...prev, value];
    });
  };

  const opts = options
    .slice(0, 4)
    .map((x) => ({ ...x, hidden: state.includes(x.value) }));

  return (
    <DocsLayout
      title="Autocomplete"
      section="form"
      description="Use autocomplete with hidden options"
    >
      <Card title="Test 1">
        <Autocomplete
          options={opts}
          onChange={onChange}
          placeholder="Test..."
          title="Choose your language"
        />
        <ul>
          {state.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Card>
    </DocsLayout>
  );
}
