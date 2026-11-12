"use client";
import { CommandPalette, type CommandItemTypes } from "@g4rcez/components";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import searchIndex from "@/generated/search-index.json";
import { sections } from "@/config/navigation";

type Entry = { description: string; props: string[]; demos: { title: string; id: string }[] };
const index = searchIndex as Record<string, Entry>;

const slugOf = (href: string) => href.replace(/^\/docs\/?/, "");

type Props = { open: boolean; onChange: (open: boolean) => void };

/** The documentation search: pages (matched by title, description and prop names) and the examples inside them. */
export const DocsSearch = ({ open, onChange }: Props) => {
    const router = useRouter();

    const commands = useMemo<CommandItemTypes[]>(() => {
        const go =
            (href: string) =>
            ({ setOpen }: { setOpen: (open: boolean) => void }) => {
                router.push(href);
                setOpen(false);
            };

        const pages: CommandItemTypes[] = sections.map((section) => ({
            type: "group",
            title: section.title,
            items: section.items.map((item) => {
                const entry = index[slugOf(item.href)];
                return {
                    type: "shortcut",
                    title: item.title,
                    hint: [section.title, entry?.description ?? "", ...(entry?.props ?? [])].filter(Boolean),
                    action: go(item.href),
                };
            }),
        }));

        const examples: CommandItemTypes[] = sections.flatMap((section) =>
            section.items.flatMap((item) =>
                (index[slugOf(item.href)]?.demos ?? []).map(
                    (demo): CommandItemTypes => ({
                        type: "shortcut",
                        title: `${item.title}: ${demo.title}`,
                        hint: [section.title],
                        action: go(`${item.href}#${demo.id}`),
                    })
                )
            )
        );

        return [...pages, { type: "group", title: "Examples", items: examples }];
    }, [router]);

    return (
        <CommandPalette
            open={open}
            commands={commands}
            onChangeVisibility={onChange}
            bind="Mod + k"
            emptyMessage="No documentation matches your search."
            translations={{
                commandPaletteTitle: "Search documentation",
                commandPaletteSearchLabel: "Search documentation",
                commandPaletteSearchPlaceholder: "Search documentation...",
            }}
        />
    );
};
