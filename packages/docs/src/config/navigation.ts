import {
  CursorIcon,
  TagIcon,
  SquaresFourIcon,
  ClockIcon,
  TableIcon,
  ChatTextIcon,
  CaretDownIcon,
  MagicWandIcon,
  ListIcon,
  SquareIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CheckSquareIcon,
  TextTIcon,
  ChartBarIcon,
  FileTextIcon,
  EyeIcon,
  BookOpenIcon,
  RocketIcon,
  GearIcon,
  TerminalIcon,
} from "@phosphor-icons/react";

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
    icon: RocketIcon,
    items: [
      { title: "Introduction", href: "/docs/get-started", icon: BookOpenIcon },
    ],
  },
  {
    title: "Display Components",
    icon: CursorIcon,
    items: [
      { title: "Button", href: "/docs/buttons", icon: CursorIcon },
      { title: "Calendar", href: "/docs/calendar", icon: CalendarIcon },
      { title: "Tag", href: "/docs/tags", icon: TagIcon },
      { title: "Tabs", href: "/docs/tabs", icon: SquaresFourIcon },
      { title: "Timeline", href: "/docs/timeline", icon: ClockIcon },
      { title: "Table", href: "/docs/table", icon: TableIcon },
      {
        title: "Page Calendar",
        href: "/docs/page-calendar",
        icon: CalendarIcon,
      },
    ],
  },
  {
    title: "Floating Elements",
    icon: ChatTextIcon,
    items: [
      { title: "Tooltip", href: "/docs/tooltip", icon: ChatTextIcon },
      { title: "Expand", href: "/docs/expand", icon: CaretDownIcon },
      { title: "Menu", href: "/docs/menu", icon: ListIcon },
      { title: "Drawer/Dialog", href: "/docs/modal", icon: SquareIcon },
      { title: "Commander", href: "/docs/commander", icon: TerminalIcon },
      { title: "Wizard", href: "/docs/wizard", icon: MagicWandIcon },
    ],
  },
  {
    title: "Form Controls",
    icon: TextTIcon,
    items: [
      {
        title: "Autocomplete",
        href: "/docs/autocomplete",
        icon: MagnifyingGlassIcon,
      },
      { title: "Checkbox", href: "/docs/checkbox", icon: CheckSquareIcon },
      { title: "Input", href: "/docs/input", icon: TextTIcon },
      { title: "MultiSelect", href: "/docs/multiselect", icon: ListIcon },
      { title: "Step", href: "/docs/step", icon: ChartBarIcon },
      { title: "useForm", href: "/docs/form", icon: FileTextIcon },
    ],
  },
  {
    title: "Utilities",
    icon: GearIcon,
    items: [
      { title: "RenderOnView", href: "/docs/render-on-view", icon: EyeIcon },
    ],
  },
];
