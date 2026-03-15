"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React, { Fragment, useEffect, useState } from "react";
import { Autocomplete, Button, Card, Modal } from "../../../../../lib/src";

const defaults = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cplusplus" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "TypeScript", value: "typescript" },
  { label: "Scala", value: "scala" },
  { label: "Perl", value: "perl" },
  { label: "Haskell", value: "haskell" },
  { label: "Objective-C", value: "objective-c" },
  { label: "R", value: "r" },
  { label: "Dart", value: "dart" },
  { label: "Elixir", value: "elixir" },
  { label: "Clojure", value: "clojure" },
  { label: "F#", value: "fsharp" },
  { label: "Lua", value: "lua" },
  { label: "Shell", value: "shell" },
  { label: "MATLAB", value: "matlab" },
  { label: "VBA", value: "vba" },
  { label: "Groovy", value: "groovy" },
  { label: "Erlang", value: "erlang" },
  { label: "Julia", value: "julia" },
  { label: "COBOL", value: "cobol" },
  { label: "Fortran", value: "fortran" },
  { label: "Ada", value: "ada" },
  { label: "Lisp", value: "lisp" },
  { label: "Prolog", value: "prolog" },
  { label: "Scheme", value: "scheme" },
  { label: "ActionScript", value: "actionscript" },
  { label: "Smalltalk", value: "smalltalk" },
  { label: "Pascal", value: "pascal" },
  { label: "Delphi", value: "delphi" },
  { label: "Visual Basic", value: "visual-basic" },
  { label: "Racket", value: "racket" },
  { label: "Crystal", value: "crystal" },
  { label: "Nim", value: "nim" },
  { label: "OCaml", value: "ocaml" },
  { label: "Forth", value: "forth" },
  { label: "D", value: "d" },
  { label: "PowerShell", value: "powershell" },
  { label: "Tcl", value: "tcl" },
  { label: "VHDL", value: "vhdl" },
  { label: "Verilog", value: "verilog" },
  { label: "Assembly", value: "assembly" },
];

const SelectOnModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Modal open={open} onChange={setOpen} title="Select on modal">
        <Autocomplete
          id="select-on-modal"
          rightLabel=" "
          title="One option"
          options={defaults}
        />
      </Modal>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
    </Fragment>
  );
};

export default function AutocompletePage() {
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
      <ComponentDemo
        title="Basic Autocomplete"
        description="A basic autocomplete with a list of programming languages. Selecting an option updates the controlled value."
        code={`"use client";
import { useState, useEffect } from "react";
import { Autocomplete } from "@g4rcez/components";

const defaults = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "TypeScript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];

function BasicAutocomplete() {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setOptions(defaults);
    setValue(defaults[0]?.value);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Autocomplete
        id="basic-demo"
        required
        value={value}
        options={options}
        title="Programming Language"
        placeholder="Select a language"
        onChange={(e) => setValue(e.target.value)}
      />
      <Autocomplete
        id="basic-demo-2"
        options={options}
        title="Overflow Demo"
        placeholder="Try searching for many options"
      />
    </div>
  );
}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Autocomplete
            id="3"
            required
            value={value}
            options={withHidden}
            title="Control option"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <Autocomplete
            id="5"
            rightLabel=" "
            title="Overflow"
            options={withHidden}
          />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Empty and Disabled States"
        description="Demonstrates autocomplete in empty and disabled states."
        code={`"use client";
import { Autocomplete } from "@g4rcez/components";

function EmptyDisabledAutocomplete() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Autocomplete
        id="empty-demo"
        options={[]}
        title="Empty Autocomplete"
        placeholder="No options available"
        emptyMessage="No results found."
      />
      <Autocomplete
        id="disabled-demo"
        disabled
        options={[]}
        title="Disabled Autocomplete"
        placeholder="This input is disabled"
        emptyMessage="No results found."
      />
    </div>
  );
}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Autocomplete in Modal"
        description="Demonstrates how Autocomplete behaves when placed inside a Modal component."
        code={`"use client";
import { useState, Fragment } from "react";
import { Autocomplete, Button, Modal } from "@g4rcez/components";

const defaults = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "TypeScript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];

function SelectOnModal() {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Modal open={open} onChange={setOpen} title="Select on modal">
        <Autocomplete
          id="select-on-modal"
          rightLabel=" "
          title="One option"
          options={defaults}
          placeholder="Choose a language"
        />
      </Modal>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
    </Fragment>
  );
}
`}
      >
        <SelectOnModal />
      </ComponentDemo>
    </DocsLayout>
  );
}
