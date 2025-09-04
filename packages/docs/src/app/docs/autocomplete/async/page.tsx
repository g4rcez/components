"use client";
import { DocsLayout } from "@/components/docs-layout";
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
      <Card
        title="Brazilian masks"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Autocomplete
          required
          id="async"
          title="Async"
          value={value}
          options={options}
          placeholder="Your language"
          onChange={(e) => setValue(e.target.value)}
        />
        <Autocomplete
          required
          id="async"
          title="Async"
          value={value}
          options={defaults}
          placeholder="Your language"
          onChange={(e) => setValue(e.target.value)}
        />
        <Autocomplete
          required
          id="async"
          title="Async"
          value=""
          options={options}
          placeholder="Your language"
        />
      </Card>
    </DocsLayout>
  );
}
