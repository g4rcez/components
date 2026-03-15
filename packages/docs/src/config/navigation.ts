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
  Terminal,
} from "lucide-react";

export type Item = {
  title: string;
  href: `/${string}`;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
};

export type Section = {
  title: string;
  items: Item[];
  icon: React.ComponentType<{ className?: string }>;
};

export const sections: Section[] = [
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
      { title: "Commander", href: "/docs/commander", icon: Terminal },
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
