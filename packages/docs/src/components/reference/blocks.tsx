import { Tag } from "@g4rcez/components";
import { InlineContent, inlineText } from "./inline";
import type { Block, Inline } from "./types";

const slugify = (value: string) =>
    value
        .toLocaleLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");

/** A sentinel cell value meaning "no default". */
const isEmptyCell = (cell: Inline[]) => ["—", "-", "–", ""].includes(inlineText(cell));

type TableProps = { columns: string[]; rows: Inline[][][]; label: string };

/** A reference table. Wide ones scroll inside their own named region (browsers make scrollers keyboard-focusable) so a 320px viewport never scrolls sideways. */
export const ReferenceTable = ({ columns, rows, label }: TableProps) => (
    <section className="docs-ref-scroll" aria-label={label}>
        <table className="docs-ref-table">
            <caption className="sr-only">{label}</caption>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column} scope="col">
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => {
                            const column = columns[cellIndex]?.toLocaleLowerCase();
                            const required = column === "default" && inlineText(cell).toLocaleLowerCase() === "required";
                            return cellIndex === 0 ? (
                                <th key={cellIndex} scope="row" className="docs-ref-name">
                                    <InlineContent nodes={cell} />
                                </th>
                            ) : (
                                <td key={cellIndex} data-column={column}>
                                    {required ? (
                                        <Tag appearance="soft" theme="primary" size="tiny">
                                            required
                                        </Tag>
                                    ) : isEmptyCell(cell) ? (
                                        <span className="docs-ref-none">—</span>
                                    ) : (
                                        <InlineContent nodes={cell} />
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </section>
);

type BlocksProps = {
    blocks: Block[];
    /** Heading level used for sub-headings inside the section (h2 is the section itself). */
    level?: 3 | 4;
    /** Prefix for generated heading ids, so repeated sub-headings stay unique across sections. */
    idPrefix: string;
    title: string;
};

export const Blocks = ({ blocks, level = 3, idPrefix, title }: BlocksProps) => {
    const Heading = `h${level}` as "h3" | "h4";
    let heading = title;
    return blocks.map((block, index) => {
        switch (block.k) {
            case "h": {
                heading = block.text;
                // A heading directly followed by another heading or nothing (its code was dropped) carries no content.
                const nextBlock = blocks[index + 1];
                if (!nextBlock || nextBlock.k === "h") return null;
                return (
                    <Heading key={index} id={`${idPrefix}-${slugify(block.text)}`} className="docs-ref-heading">
                        {block.text}
                    </Heading>
                );
            }
            case "p":
                return (
                    <p key={index} className="docs-ref-text">
                        <InlineContent nodes={block.c} />
                    </p>
                );
            case "ul":
                return (
                    <ul key={index} className="docs-ref-list">
                        {block.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                                <InlineContent nodes={item} />
                            </li>
                        ))}
                    </ul>
                );
            case "code":
                return (
                    <pre key={index} className="docs-ref-pre">
                        <code>{block.v}</code>
                    </pre>
                );
            case "table":
                return (
                    <ReferenceTable
                        key={index}
                        columns={block.columns}
                        rows={block.rows}
                        label={`${title} ${heading === title ? "" : `${heading} `}${block.columns[0] ?? ""} reference`.replace(/\s+/g, " ")}
                    />
                );
        }
    });
};
