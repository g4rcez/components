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
  StackSimpleIcon,
  CubeIcon,
  FrameCornersIcon,
  PuzzlePieceIcon,
  ParagraphIcon,
  BellIcon,
  WarningIcon,
  RadioIcon,
  ToggleLeftIcon,
  ArrowsLeftRightIcon,
  UploadSimpleIcon,
  FunnelIcon,
  TextAlignLeftIcon,
  ArrowCounterClockwiseIcon,
  CircleNotchIcon,
  SlidersHorizontalIcon,
  CommandIcon,
  FolderOpenIcon,
  CircleDashedIcon,
  CreditCardIcon,
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
      {
        title: "Design Tokens",
        href: "/docs/design-tokens",
        icon: SlidersHorizontalIcon,
      },
      {
        title: "Theme Setup",
        href: "/docs/setup",
        icon: GearIcon,
      },
    ],
  },
  {
    title: "Primitives",
    icon: StackSimpleIcon,
    items: [
      { title: "Heading", href: "/docs/heading", icon: TextTIcon },
      { title: "Polymorph", href: "/docs/polymorph", icon: CubeIcon },
      { title: "Resizable", href: "/docs/resizable", icon: FrameCornersIcon },
      { title: "Slot", href: "/docs/slot", icon: PuzzlePieceIcon },
      { title: "Typography", href: "/docs/typography", icon: ParagraphIcon },
    ],
  },
  {
    title: "Display Components",
    icon: CursorIcon,
    items: [
      { title: "Alert", href: "/docs/alert", icon: WarningIcon },
      { title: "Button", href: "/docs/buttons", icon: CursorIcon },
      {
        title: "Button Group",
        href: "/docs/button-group",
        icon: SquaresFourIcon,
      },
      { title: "Calendar", href: "/docs/calendar", icon: CalendarIcon },
      { title: "Cards", href: "/docs/cards", icon: CreditCardIcon },
      { title: "Empty", href: "/docs/empty", icon: FolderOpenIcon },
      { title: "List", href: "/docs/list", icon: ListIcon },
      { title: "Notification", href: "/docs/notification", icon: BellIcon },
      { title: "Progress", href: "/docs/progress", icon: ChartBarIcon },
      { title: "Shortcut", href: "/docs/shortcut", icon: CommandIcon },
      { title: "Skeleton", href: "/docs/skeleton", icon: CircleDashedIcon },
      { title: "Spinner", href: "/docs/spinner", icon: CircleNotchIcon },
      { title: "Stats", href: "/docs/stats", icon: ChartBarIcon },
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
      { title: "Dropdown", href: "/docs/dropdown", icon: CaretDownIcon },
      { title: "Expand", href: "/docs/expand", icon: CaretDownIcon },
      { title: "Menu", href: "/docs/menu", icon: ListIcon },
      { title: "Drawer/Dialog", href: "/docs/modal", icon: SquareIcon },
      { title: "Toolbar", href: "/docs/toolbar", icon: SquaresFourIcon },
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
      { title: "Date Picker", href: "/docs/date-picker", icon: CalendarIcon },
      {
        title: "File Upload",
        href: "/docs/file-upload",
        icon: UploadSimpleIcon,
      },
      { title: "Filter Bar", href: "/docs/filter-bar", icon: FunnelIcon },
      {
        title: "Form Reset",
        href: "/docs/form-reset",
        icon: ArrowCounterClockwiseIcon,
      },
      { title: "Free Text", href: "/docs/free-text", icon: TextTIcon },
      { title: "Input", href: "/docs/input", icon: TextTIcon },
      { title: "InputField", href: "/docs/input-field", icon: FileTextIcon },
      { title: "MultiSelect", href: "/docs/multiselect", icon: ListIcon },
      { title: "Radiobox", href: "/docs/radiobox", icon: RadioIcon },
      { title: "Select", href: "/docs/select", icon: ListIcon },
      { title: "Slider", href: "/docs/slider", icon: SlidersHorizontalIcon },
      { title: "Step", href: "/docs/step", icon: ChartBarIcon },
      { title: "Switch", href: "/docs/switch", icon: ToggleLeftIcon },
      { title: "Task List", href: "/docs/task-list", icon: CheckSquareIcon },
      { title: "Textarea", href: "/docs/textarea", icon: TextAlignLeftIcon },
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
