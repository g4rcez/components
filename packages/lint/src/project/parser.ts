// Parses component files for variant axes and className forwarding.
// Oxc handles JavaScript, JSX, TypeScript, and TSX without a second parser
// dependency.

import { createRequire } from "node:module";
import * as path from "node:path";

const require = createRequire(import.meta.url);

export type ParserKind = "oxc";

type Parser = { parse: (source: string, file: string) => any };

function langOf(file: string) {
    switch (path.extname(file).toLowerCase()) {
        case ".tsx":
            return "tsx";
        case ".ts":
        case ".mts":
        case ".cts":
            return "ts";
        case ".jsx":
            return "jsx";
        default:
            return "js";
    }
}

function loadOxc(): Parser {
    const oxc = require("oxc-parser") as {
        parseSync: (file: string, source: string, options: { lang: string; sourceType: string }) => { program: any; errors: { severity: string }[] };
    };

    return {
        parse(source, file) {
            const result = oxc.parseSync(path.basename(file), source, {
                lang: langOf(file),
                sourceType: "module",
            });
            // Recoverable errors still yield a usable program. A file that
            // did not parse at all is treated as an unavailable component.
            if (!result.program?.body?.length && result.errors.some((error) => error.severity === "Error")) {
                throw new Error("oxc-parser: unparsable");
            }
            return result.program;
        },
    };
}

export function createParser(kind?: ParserKind): Parser {
    if (kind && kind !== "oxc") throw new Error(`Unsupported parser: ${kind}`);
    return loadOxc();
}

let active: Parser | null = null;

// Parses `source` as the module at `file`. Throws when Oxc cannot parse it.
export function parseSource(source: string, file: string) {
    active ??= createParser();
    return active.parse(source, file);
}

// The parser in use, for diagnostics and tests.
export function activeParserKind(): ParserKind {
    active ??= createParser();
    return "oxc";
}

export function useParser(kind: ParserKind | null) {
    active = kind ? createParser(kind) : null;
}
