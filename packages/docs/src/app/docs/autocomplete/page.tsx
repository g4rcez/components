"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useEffect, useState } from "react";
import { Autocomplete, Card } from "../../../../../lib/src";

const defaults = Array.from({ length: 300 }).map((_, i) => ({
  value: i.toString(),
  label: `[${i + 1}] Paullum deliquit, ponderibus modulisque suis ratio utitur.`,
}));

export default function FormPage() {
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const withHidden = options.map((x) => ({ ...x, hidden: value === x.value }));

  useEffect(() => {
    setTimeout(() => {
      setOptions(defaults);
      setValue(defaults[0]?.value);
    }, 0);
  }, []);

  return (
    <DocsLayout
      section="form"
      title="Autocomplete"
      description="Multiple options with a beautiful search input."
    >
      <Card
        title="Brazilian masks"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Autocomplete
            id="3"
            rightLabel=" "
            title="One option"
            options={withHidden.slice(0, 2)}
        />
        <Autocomplete
          id="0"
          required
          value={value}
          options={withHidden}
          title="Control option"
          onChange={(e) => {
            setValue(e.target.value);
            console.log(e.target.value);
          }}
        />
        <Autocomplete
          id="1"
          options={[]}
          title="Empty"
          rightLabel=" "
          emptyMessage="Empty message..."
        />
        <Autocomplete
          id="2"
          disabled
          options={[]}
          rightLabel=" "
          title="Disabled"
          emptyMessage="Empty message..."
        />
        <Autocomplete
          id="5"
          rightLabel=" "
          title="Overflow"
          options={withHidden}
        />
        <Autocomplete
          id="6"
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
