"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React, { useEffect, useState } from "react";
import { Autocomplete, Card } from "../../../../../../lib/src";

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

export default function FormPage() {
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState("typescript");

  useEffect(() => {
    setTimeout(() => {
      setOptions(defaults);
    }, 2000);
  }, []);

  return (
    <DocsLayout
      section="form"
      title="Autocomplete"
      description="Multiple options with a beautiful search input."
    >
      <ComponentDemo
        title="Asynchronous Autocomplete"
        description="Demonstrates an autocomplete component that loads its options asynchronously after a delay."
        code={`"use client";
import { useState, useEffect } from "react";
import { Autocomplete, Card } from "@g4rcez/components";

const defaults = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
];

function AsyncAutocompleteDemo() {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("typescript");

  useEffect(() => {
    setTimeout(() => {
      setOptions(defaults);
    }, 2000); // Simulate network delay
  }, []);

  return (
    <Card title="Asynchronous Loading">
      <Autocomplete
        required
        id="async-demo"
        title="Programming Language"
        value={value}
        options={options}
        placeholder="Loading options..."
        onChange={(e) => setValue(e.target.value)}
      />
    </Card>
  );
}`}
      >
        <Card title="Asynchronous Loading" className="grid grid-cols-1 gap-6">
          <Autocomplete
            required
            id="async"
            title="Async"
            value={value}
            options={options}
            placeholder="Your language"
            onChange={(e) => setValue(e.target.value)}
          />
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Autocomplete with Pre-filled Default Options"
        description="An asynchronous autocomplete pre-filled with a default value, demonstrating immediate display while other options load."
        code={`"use client";
import { useState, useEffect } from "react";
import { Autocomplete, Card } from "@g4rcez/components";

const defaults = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
];

function AsyncAutocompletePrefilled() {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("typescript");

  useEffect(() => {
    // Only set options after a delay, but value is immediate
    setTimeout(() => {
      setOptions(defaults);
    }, 2000);
  }, []);

  return (
    <Card title="Prefilled Async Autocomplete">
      <Autocomplete
        required
        id="async-prefilled"
        title="Programming Language"
        value={value}
        options={options} // Options will load later
        placeholder="Your language"
        onChange={(e) => setValue(e.target.value)}
      />
    </Card>
  );
}`}
      >
        <Card title="Prefilled Async Autocomplete" className="grid grid-cols-1 gap-6">
          <Autocomplete
            required
            id="async-prefilled-demo"
            title="Async"
            value={value}
            options={defaults} // Using defaults here as a workaround for the demo to show options immediately
            placeholder="Your language"
            onChange={(e) => setValue(e.target.value)}
          />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
