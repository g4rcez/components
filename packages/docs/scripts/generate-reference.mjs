// Parses packages/lib/ai/docs/*.md into one JSON file per docs page, plus a loader map and a search index.
//
//   node scripts/generate-reference.mjs          write src/generated/**
//   pnpm reference:check                          regenerate and fail if the committed output differs
//
// Inline content is converted to a small AST (text / code / strong / em / link), so the page never needs
// dangerouslySetInnerHTML. Sections are found by heading text, never by position, because their order varies.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Lexer } from "marked";
import YAML from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(here, "..");
const aiDocs = resolve(docsRoot, "../lib/ai/docs");
const pagesDir = join(docsRoot, "src/app/docs");
const outDir = join(docsRoot, "src/generated");
const repo = "https://github.com/g4rcez/components";

/** Docs routes whose markdown file is not simply PascalCase(slug). `null` means the page has no component reference. */
export const OVERRIDES = {
    buttons: "Button",
    cards: "Card",
    commander: "CommandPalette",
    form: "Form",
    "form-reset": "FormReset",
    list: "AnimatedList",
    multiselect: "MultiSelect",
    notification: "Notifications",
    tags: "Tag",
    "swippeable-list": "SwipeableList",
    "drawing-editor": "drawing-editor",
    "video-player": "video-player",
    "get-started": null,
    setup: null,
    "button-group": null,
    "filter-bar": null,
    "input-button-form": null,
};

const SECTION_ALIASES = {
    props: ["props", "components", "parameters", "signature", "exports", "api"],
    attributes: ["data attributes"],
    tokens: ["design tokens", "design tokens and css", "tokens and selectors", "design tokens and surfaces"],
    accessibility: ["accessibility"],
    interaction: ["interaction design and acceptance criteria"],
    do: ["do"],
    dont: ["don't"],
};

const pascal = (slug) =>
    slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

const decode = (value) => value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

/** markdown file basename -> docs slug, filled while mapping, so links between docs can be routed. */
const fileToSlug = new Map();

const rewriteHref = (href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    const [path, hash] = href.split("#");
    const base = path.replace(/^\.\//, "");
    const name = base.replace(/\.md$/, "");
    const routed = fileToSlug.get(name);
    if (routed !== undefined) return `/docs/${routed}${hash ? `#${hash}` : ""}`;
    return `${repo}/blob/main/packages/lib/ai/docs/${base}${hash ? `#${hash}` : ""}`;
};

const inline = (tokens = []) => {
    const out = [];
    for (const token of tokens) {
        switch (token.type) {
            case "codespan":
                out.push({ t: "code", v: decode(token.text) });
                break;
            case "strong":
                out.push({ t: "strong", c: inline(token.tokens) });
                break;
            case "em":
                out.push({ t: "em", c: inline(token.tokens) });
                break;
            case "del":
                out.push(...inline(token.tokens));
                break;
            case "link":
                out.push({ t: "link", href: rewriteHref(token.href), c: inline(token.tokens) });
                break;
            case "br":
                out.push({ t: "text", v: " " });
                break;
            case "text":
                if (token.tokens?.length) out.push(...inline(token.tokens));
                else out.push({ t: "text", v: decode(token.text) });
                break;
            default:
                out.push({ t: "text", v: decode(token.text ?? token.raw ?? "") });
        }
    }
    // merge neighbouring text nodes
    return out.reduce((merged, node) => {
        const last = merged[merged.length - 1];
        if (node.t === "text" && last?.t === "text") last.v += node.v;
        else merged.push(node);
        return merged;
    }, []);
};

const listItems = (list) => {
    const items = [];
    for (const item of list.items) {
        const head = item.tokens.filter((token) => token.type === "text" || token.type === "paragraph");
        items.push(head.flatMap((token) => inline(token.tokens ?? [token])));
        for (const nested of item.tokens.filter((token) => token.type === "list")) items.push(...listItems(nested));
    }
    return items;
};

const blocksOf = (tokens) => {
    const blocks = [];
    for (const token of tokens) {
        if (token.type === "paragraph") blocks.push({ k: "p", c: inline(token.tokens) });
        else if (token.type === "list") blocks.push({ k: "ul", items: listItems(token) });
        else if (token.type === "heading") blocks.push({ k: "h", text: token.text.replace(/`/g, "") });
        else if (token.type === "table") {
            blocks.push({
                k: "table",
                columns: token.header.map((cell) => decode(cell.text)),
                rows: token.rows.map((row) => row.map((cell) => inline(cell.tokens))),
            });
        } else if (token.type === "code") blocks.push({ k: "code", lang: token.lang ?? "", v: token.text });
        else if (token.type === "blockquote") blocks.push(...blocksOf(token.tokens));
        // hr and spaces are decoration
    }
    return blocks;
};

const splitSections = (tokens) => {
    const sections = [];
    const lead = [];
    let current = null;
    for (const token of tokens) {
        if (token.type === "heading" && token.depth === 1) continue;
        if (token.type === "heading" && token.depth === 2) {
            current = { title: token.text.trim(), tokens: [] };
            sections.push(current);
        } else if (current) current.tokens.push(token);
        else lead.push(token);
    }
    return { lead, sections };
};

const pick = (sections, key) => sections.filter((section) => SECTION_ALIASES[key].includes(section.title.toLowerCase()));

const mergedBlocks = (sections, key) => {
    const found = pick(sections, key);
    // when several aliases exist, keep their titles as sub-headings so tables stay attributable
    return found.flatMap((section) => (found.length > 1 ? [{ k: "h", text: section.title }, ...blocksOf(section.tokens)] : blocksOf(section.tokens)));
};

const parseFile = (basename) => {
    const raw = readFileSync(join(aiDocs, `${basename}.md`), "utf8");
    const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) return null;
    const meta = YAML.parse(match[1]);
    const { lead, sections } = splitSections(Lexer.lex(raw.slice(match[0].length)));
    return {
        title: meta.title ?? basename,
        description: meta.description ?? "",
        import: meta.import ?? "",
        category: meta.category ?? "",
        export: meta.export ?? "",
        source: `${repo}/blob/main/packages/lib/ai/docs/${basename}.md`,
        lead: blocksOf(lead),
        props: mergedBlocks(sections, "props"),
        attributes: mergedBlocks(sections, "attributes"),
        tokens: mergedBlocks(sections, "tokens"),
        usage: {
            do: mergedBlocks(sections, "do").flatMap((block) => (block.k === "ul" ? block.items : [])),
            dont: mergedBlocks(sections, "dont").flatMap((block) => (block.k === "ul" ? block.items : [])),
        },
        accessibility: mergedBlocks(sections, "accessibility"),
        interaction: mergedBlocks(sections, "interaction"),
    };
};

const slugify = (value) => value.toLocaleLowerCase().replace(/\s+/g, "-");

const demoTitles = (slug) => {
    const file = join(pagesDir, slug, "page.tsx");
    if (!existsSync(file)) return [];
    const titles = [...readFileSync(file, "utf8").matchAll(/<ComponentDemo\s+title="([^"]+)"/g)].map((m) => m[1]);
    return titles.map((title) => ({ title, id: slugify(title) }));
};

const propNames = (props) =>
    props
        .filter((block) => block.k === "table")
        .flatMap((block) => block.rows.map((row) => row[0]?.map((node) => node.v ?? "").join("") ?? ""))
        .map((name) => name.replace(/[^\w$-]/g, ""))
        .filter(Boolean);

export const generate = () => {
    const files = new Set(readdirSync(aiDocs).filter((name) => name.endsWith(".md")).map((name) => name.replace(/\.md$/, "")));
    const slugs = readdirSync(pagesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && existsSync(join(pagesDir, entry.name, "page.tsx")))
        .map((entry) => entry.name)
        .sort();

    const mapping = new Map();
    for (const slug of slugs) {
        const wanted = slug in OVERRIDES ? OVERRIDES[slug] : pascal(slug);
        if (wanted === null) continue;
        if (!files.has(wanted)) {
            if (slug in OVERRIDES) throw new Error(`docs/${slug} maps to ${wanted}.md, which does not exist`);
            continue;
        }
        mapping.set(slug, wanted);
        fileToSlug.set(wanted, slug);
    }

    rmSync(join(outDir, "reference"), { recursive: true, force: true });
    mkdirSync(join(outDir, "reference"), { recursive: true });

    const search = {};
    const loaders = [];
    for (const [slug, basename] of mapping) {
        const data = parseFile(basename);
        if (!data) throw new Error(`${basename}.md has no frontmatter`);
        writeFileSync(join(outDir, "reference", `${slug}.json`), `${JSON.stringify(data)}\n`);
        loaders.push(`    ${JSON.stringify(slug)}: () => import(${JSON.stringify(`./${slug}.json`)}),`);
        search[slug] = { description: data.description, props: propNames(data.props).slice(0, 80), demos: demoTitles(slug) };
    }
    for (const slug of slugs.filter((slug) => !mapping.has(slug))) search[slug] = { description: "", props: [], demos: demoTitles(slug) };

    writeFileSync(
        join(outDir, "reference", "index.ts"),
        `// Generated by scripts/generate-reference.mjs. Do not edit.\nimport type { Reference } from "@/components/reference/types";\n\ntype Loader = () => Promise<{ default: unknown }>;\n\nconst raw: Record<string, Loader> = {\n${loaders.join("\n")}\n};\n\nexport const referenceSlugs = Object.keys(raw);\n\nexport const loadReference = async (slug: string): Promise<Reference | null> => {\n    const load = raw[slug];\n    return load ? ((await load()).default as Reference) : null;\n};\n`,
    );
    writeFileSync(join(outDir, "search-index.json"), `${JSON.stringify(search)}\n`);

    const unmapped = [...files].filter((name) => !fileToSlug.has(name) && !["index", "geometry-tokens", "theme-customization", "style-dependencies", "pdf-viewer"].includes(name));
    return { mapped: mapping.size, pages: slugs.length, unmapped };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const { mapped, pages, unmapped } = generate();
    console.log(`reference: ${mapped} of ${pages} docs pages mapped to ai/docs markdown`);
    if (unmapped.length) console.warn(`reference: markdown without a docs page: ${unmapped.join(", ")}`);
}
