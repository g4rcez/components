export type Paradigm = "Functional" | "Object-oriented" | "Systems" | "Multi-paradigm" | "Logic" | "Scripting";

export type Language = { id: string; name: string; creator: string; paradigm: Paradigm };

export const paradigmTheme = {
    Functional: "secondary",
    "Object-oriented": "info",
    Systems: "primary",
    "Multi-paradigm": "success",
    Logic: "danger",
    Scripting: "warn",
} as const satisfies Record<Paradigm, string>;

const language = (name: string, creator: string, paradigm: Paradigm): Language => ({ id: "", name, creator, paradigm });

const base: Language[] = [
    language("Ada", "Jean Ichbiah", "Systems"),
    language("Bash", "Brian Fox", "Scripting"),
    language("C", "Dennis Ritchie", "Systems"),
    language("C#", "Anders Hejlsberg", "Object-oriented"),
    language("C++", "Bjarne Stroustrup", "Systems"),
    language("Clojure", "Rich Hickey", "Functional"),
    language("CoffeeScript", "Jeremy Ashkenas", "Scripting"),
    language("Crystal", "Ary Borenszweig", "Object-oriented"),
    language("D", "Walter Bright", "Systems"),
    language("Eiffel", "Bertrand Meyer", "Object-oriented"),
    language("Elixir", "José Valim", "Functional"),
    language("Elm", "Evan Czaplicki", "Functional"),
    language("Erlang", "Joe Armstrong", "Functional"),
    language("F#", "Don Syme", "Functional"),
    language("Forth", "Charles Moore", "Systems"),
    language("Fortran", "John Backus", "Systems"),
    language("Gleam", "Louis Pilfold", "Functional"),
    language("Groovy", "James Strachan", "Object-oriented"),
    language("Hare", "Drew DeVault", "Systems"),
    language("Haxe", "Nicolas Cannasse", "Multi-paradigm"),
    language("Io", "Steve Dekorte", "Object-oriented"),
    language("Java", "James Gosling", "Object-oriented"),
    language("JavaScript", "Brendan Eich", "Scripting"),
    language("Kotlin", "Andrey Breslav", "Multi-paradigm"),
    language("Lisp", "John McCarthy", "Functional"),
    language("Lua", "Roberto Ierusalimschy", "Scripting"),
    language("Mercury", "Zoltan Somogyi", "Logic"),
    language("Modula-2", "Niklaus Wirth", "Systems"),
    language("Nim", "Andreas Rumpf", "Systems"),
    language("Objective-C", "Brad Cox", "Object-oriented"),
    language("OCaml", "Xavier Leroy", "Functional"),
    language("Odin", "Ginger Bill", "Systems"),
    language("Pascal", "Niklaus Wirth", "Systems"),
    language("Perl", "Larry Wall", "Scripting"),
    language("PHP", "Rasmus Lerdorf", "Scripting"),
    language("Prolog", "Alain Colmerauer", "Logic"),
    language("Python", "Guido van Rossum", "Multi-paradigm"),
    language("Racket", "Matthias Felleisen", "Functional"),
    language("Ruby", "Yukihiro Matsumoto", "Object-oriented"),
    language("Rust", "Graydon Hoare", "Systems"),
    language("Scala", "Martin Odersky", "Multi-paradigm"),
    language("Smalltalk", "Alan Kay", "Object-oriented"),
    language("Swift", "Chris Lattner", "Multi-paradigm"),
    language("Tcl", "John Ousterhout", "Scripting"),
    language("TypeScript", "Anders Hejlsberg", "Multi-paradigm"),
    language("Wolfram Language", "Stephen Wolfram", "Multi-paradigm"),
    language("Zig", "Andrew Kelley", "Systems"),
];

const total = 200;

/** Cycles the base list up to 200 rows. Repeats get a numeric suffix. Ids follow the position, so they are always unique. */
export const languages: Language[] = Array.from({ length: total }, (_, index) => {
    const item = base[index % base.length];
    const round = Math.floor(index / base.length);
    return { ...item, id: `language-${index + 1}`, name: round === 0 ? item.name : `${item.name} ${round + 1}` };
});
