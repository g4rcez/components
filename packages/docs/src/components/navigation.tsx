"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  title: string;
  href: `/${string}`;
};

type Section = {
  title: string;
  items: Item[];
};

const sections: Section[] = [
  {
    title: "Display",
    items: [
      { title: "Button", href: "/docs/buttons" },
      { title: "Tag", href: "/docs/tags" },
      { title: "Tabs", href: "/docs/tabs" },
      { title: "Timeline", href: "/docs/timeline" },
      { title: "Table", href: "/docs/table" },
    ],
  },
  {
    title: "Floating",
    items: [
      { title: "Tooltip", href: "/docs/tooltip" },
      { title: "Expand", href: "/docs/expand" },
      { title: "Menu", href: "/docs/menu" },
      { title: "Drawer/Dialog", href: "/docs/modal" },
    ],
  },
  {
    title: "Form",
    items: [
      { title: "Autocomplete", href: "/docs/autocomplete" },
      { title: "Calendar", href: "/docs/calendar" },
      { title: "Checkbox", href: "/docs/checkbox" },
      { title: "Input", href: "/docs/input" },
      { title: "MultiSelect", href: "/docs/multiselect" },
      { title: "Step", href: "/docs/step" },
      { title: "useForm", href: "/docs/form" },
    ],
  },
  {
    title: "Utilities",
    items: [{ title: "RenderOnView", href: "/docs/render-on-view" }],
  },
];

export const Navigation = () => {
  const path = usePathname();
  return (
    <ul className="lg:px-[var(--sidebar-padding)] lg:py-4 space-y-4 text-sm">
      {sections.map((section) => (
        <li key={`section-${section.title}`}>
          <header className="mb-2 font-semibold leading-relaxed tracking-wide">
            {section.title}
          </header>
          <ul className="lg:px-[var(--sidebar-item-padding)] space-y-2">
            {section.items.map((item) => {
              return (
                <li
                  key={`section-item-${item.title}`}
                  className={
                    path === item.href ? "text-primary font-medium" : undefined
                  }
                >
                  <Link href={item.href}>{item.title}</Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
};
