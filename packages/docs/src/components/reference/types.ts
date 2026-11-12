/** Shape of the JSON generated from packages/lib/ai/docs/*.md by scripts/generate-reference.mjs. */
export type Inline =
    | { t: "text"; v: string }
    | { t: "code"; v: string }
    | { t: "strong"; c: Inline[] }
    | { t: "em"; c: Inline[] }
    | { t: "link"; href: string; c: Inline[] };

export type Block =
    | { k: "p"; c: Inline[] }
    | { k: "ul"; items: Inline[][] }
    | { k: "h"; text: string }
    | { k: "code"; lang: string; v: string }
    | { k: "table"; columns: string[]; rows: Inline[][][] };

export type Reference = {
    title: string;
    description: string;
    import: string;
    category: string;
    export: string;
    source: string;
    lead: Block[];
    props: Block[];
    attributes: Block[];
    tokens: Block[];
    usage: { do: Inline[][]; dont: Inline[][] };
    accessibility: Block[];
    interaction: Block[];
};
