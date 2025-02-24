"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useEffect, useState } from "react";
import { Autocomplete, VirtualAutocomplete, Card } from "../../../../../lib/src";

const defaults = Array.from({ length: 5000 }).map((_, i) => ({
  value: i.toString(),
  label: `[${i + 1}] Paullum deliquit, ponderibus modulisque suis ratio utitur.`,
}));

export default function FormPage() {
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState(defaults[0]?.value);
  const withHidden = options.map((x) => ({ ...x, hidden: value === x.value }));
  useEffect(() => {
    setTimeout(() => {
      setOptions(defaults);
      setValue(defaults[0]?.value);
    }, 0);
  }, []);
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
        <VirtualAutocomplete
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
          rightLabel=" "
          options={[]}
          title="Empty"
          emptyMessage="Empty message..."
        />
        <Autocomplete
          id="2"
          disabled
          rightLabel=" "
          options={[]}
          title="Disabled"
          emptyMessage="Empty message..."
        />
        <Autocomplete
          id="3"
          rightLabel=" "
          options={options.slice(0, 2)}
          title="One option"
        />
        <Autocomplete
          id="5"
          rightLabel=" "
          options={options}
          title="Overflow"
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
