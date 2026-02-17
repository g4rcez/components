"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MousePointer,
  Tag,
  Layout,
  Clock,
  Table,
  MessageSquare,
  ChevronDown,
  Menu,
  Square,
  Search,
  Calendar,
  CheckSquare,
  Type,
  List,
  BarChart3,
  FileText,
  Eye,
  BookOpen,
  Rocket,
  CogIcon,
} from "lucide-react";

type Item = {
  title: string;
  href: `/${string}`;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
};

type Section = {
  title: string;
  items: Item[];
  icon: React.ComponentType<{ className?: string }>;
};

const sections: Section[] = [
  {
    title: "Getting Started",
    icon: Rocket,
    items: [
      { title: "Introduction", href: "/docs/get-started", icon: BookOpen },
    ],
  },
  {
    title: "Display Components",
    icon: MousePointer,
    items: [
      { title: "Button", href: "/docs/buttons", icon: MousePointer },
      { title: "Tag", href: "/docs/tags", icon: Tag },
      { title: "Tabs", href: "/docs/tabs", icon: Layout },
      { title: "Timeline", href: "/docs/timeline", icon: Clock },
      { title: "Table", href: "/docs/table", icon: Table },
    ],
  },
  {
    title: "Floating Elements",
    icon: MessageSquare,
    items: [
      { title: "Tooltip", href: "/docs/tooltip", icon: MessageSquare },
      { title: "Expand", href: "/docs/expand", icon: ChevronDown },
      { title: "Menu", href: "/docs/menu", icon: Menu },
      { title: "Drawer/Dialog", href: "/docs/modal", icon: Square },
    ],
  },
  {
    title: "Form Controls",
    icon: Type,
    items: [
      { title: "Autocomplete", href: "/docs/autocomplete", icon: Search },
      { title: "Calendar", href: "/docs/calendar", icon: Calendar },
      { title: "Checkbox", href: "/docs/checkbox", icon: CheckSquare },
      { title: "Input", href: "/docs/input", icon: Type },
      { title: "MultiSelect", href: "/docs/multiselect", icon: List },
      { title: "Step", href: "/docs/step", icon: BarChart3 },
      { title: "useForm", href: "/docs/form", icon: FileText },
    ],
  },
  {
    title: "Utilities",
    icon: CogIcon,
    items: [{ title: "RenderOnView", href: "/docs/render-on-view", icon: Eye }],
  },
];

export const Navigation = () => {
  const path = usePathname();
  return (
    <nav className="py-6 px-[var(--sidebar-padding)]">
      <div className="space-y-6">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={`section-${section.title}`} className="space-y-3">
              <div className="flex gap-2 items-center px-2">
                <SectionIcon className="size-4" />
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = path === item.href;
                  const ItemIcon = item.icon;

                  return (
                    <li key={`section-item-${item.title}`}>
                      <Link
                        href={item.href}
                        className={`
                          group flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm font-medium transition-all duration-200
                          ${
                            isActive
                              ? "bg-primary/10 text-primary border-l-2 border-primary shadow-sm"
                              : "hover:text-primary hover:bg-card-background/40"
                          }
                        `}
                      >
                        {ItemIcon && (
                          <ItemIcon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? "text-primary"
                                : "group-hover:text-primary"
                            }`}
                          />
                        )}
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="py-0.5 px-1.5 text-xs rounded-full bg-primary/20 text-primary">
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
