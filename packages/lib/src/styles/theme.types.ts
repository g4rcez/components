type N = `${number}`;

export type GeneralTokens = { [K in string]: string | GeneralTokens };

export type ThemeState = "primary" | "warn" | "secondary" | "info" | "danger" | "success" | "neutral" | "muted";

type BasicTokens = {
    hover: string;
    subtle: string;
    DEFAULT: string;
    foreground: string;
};

type ComponentToken = {
    hover: string;
    border: string;
    overlay: string;
    background: string;
    foreground: string;
};

export type ZIndex = {
    wizard: N;
    navbar: N;
    normal: N;
    overlay: N;
    tooltip: N;
    calendar: N;
    floating: N;
};

type Shadows = "floating" | "card" | "notification" | "table";

export type CardTokens = {
    radius: string;
    "padding-x": string;
    "padding-y": string;
    gap: string;
    "title-pb": string;
    "title-mb": string;
    "stats-icon-col-w": string;
    "stats-icon-col-p": string;
    "stats-content-gap": string;
    "stats-content-py": string;
    "title-text": string;
};

export type ButtonTokens = {
    radius: string;
    height: string;
    "padding-x": string;
    "padding-y": string;
    gap: string;
    "height-big": string;
    "padding-x-big": string;
    "padding-y-big": string;
    "height-small": string;
    "padding-x-small": string;
    "padding-y-small": string;
    "height-min": string;
    "padding-x-min": string;
    "padding-y-min": string;
    "height-tiny": string;
    "padding-x-tiny": string;
    "padding-y-tiny": string;
    "padding-icon": string;
    "radius-rough": string;
    "radius-squared": string;
};

export type AlertTokens = {
    radius: string;
    p: string;
    gap: string;
    "close-top": string;
    "close-right": string;
};

export type ModalTokens = {
    radius: string;
    "padding-x": string;
    "padding-y": string;
    gap: string;
    "title-pb": string;
    "body-py": string;
    "footer-pt": string;
    "footer-gap": string;
    "sheet-pt": string;
    "sheet-pb": string;
    "close-p": string;
    "close-top": string;
    "close-right": string;
    "confirm-py": string;
    "sheet-handle-h": string;
    "sheet-handle-py": string;
    "sheet-pill-h": string;
    "sheet-pill-w": string;
    "sheet-pill-radius": string;
    "drawer-resizer-h": string;
    "drawer-resizer-w": string;
    "resizer-radius": string;
    "overlay-pt": string;
    "overlay-p": string;
    "dialog-max-w-mobile": string;
    "sheet-max-h-svh": string;
    "sheet-max-h-lvh": string;
    "sheet-max-h-vh": string;
    "title-text": string;
    "overlay-h": string;
};

export type DropdownTokens = {
    radius: string;
    p: string;
    "header-mb": string;
    "max-h": string;
};

export type TooltipTokens = {
    radius: string;
    p: string;
};

export type MenuTokens = {
    radius: string;
    "item-p": string;
    "max-h": string;
};

export type StatsTokens = {
    radius: string;
    p: string;
    gap: string;
    "icon-size": string;
    "icon-p": string;
    "inner-gap": string;
    "footer-px": string;
    "footer-py": string;
    "value-text": string;
};

export type NotificationTokens = {
    radius: string;
    p: string;
    gap: string;
    "inner-gap": string;
    "close-p": string;
    "close-radius": string;
    "list-gap": string;
    "badge-px": string;
    "badge-py": string;
    "list-top": string;
    "list-max-w": string;
    "badge-text": string;
};

export type CommandTokens = {
    radius: string;
    "item-p": string;
    "item-gap": string;
    "row-h": string;
    "header-h": string;
    "footer-h": string;
    "footer-p": string;
    "list-max-h": string;
    "list-gap": string;
    "list-my": string;
    "group-px": string;
    "group-pt": string;
    "group-pb": string;
    "icon-size": string;
    "input-px": string;
    "input-py": string;
    "list-px": string;
};

export type TagTokens = {
    radius: string;
    gap: string;
    height: string;
    "padding-x": string;
    "padding-y": string;
    "height-big": string;
    "padding-x-big": string;
    "padding-y-big": string;
    "height-small": string;
    "padding-x-small": string;
    "padding-y-small": string;
    "height-tiny": string;
    "padding-x-tiny": string;
    "padding-y-tiny": string;
    "padding-icon": string;
    "indicator-size": string;
};

export type CalendarTokens = {
    "cell-p": string;
    "day-size": string;
    "nav-p": string;
    "weekday-py": string;
    "table-mt": string;
    "datetime-my": string;
    "footer-mt": string;
    "header-radius": string;
    "nav-gap": string;
    "nav-py": string;
    "year-w": string;
    "icon-size": string;
    "weekday-text": string;
    "cell-text": string;
};

export type TableTokens = {
    radius: string;
    "row-gap": string;
    "row-pb": string;
    "cell-px": string;
    "loading-h": string;
    "empty-h": string;
    "groups-gap": string;
    "metadata-mb": string;
    "metadata-gap-x": string;
    "metadata-gap-y": string;
    "ops-py": string;
    "ops-gap": string;
    "filter-gap": string;
    "pill-radius": string;
    "pill-px": string;
    "pill-py": string;
    "pag-p": string;
    "pag-gap": string;
    "pag-items-gap": string;
    "pag-item-px": string;
    "pag-item-py": string;
    "loading-bar-h": string;
    "loading-bar-radius": string;
    "filter-dot-size": string;
    "filter-dot-mr": string;
    "filter-row-gap": string;
    "filter-inline-gap": string;
    "filter-inline-py": string;
    "filter-list-mt": string;
    "cell-border": string;
    "divider-w": string;
    "groups-mt": string;
    "groups-my": string;
    "metadata-min-w": string;
    "inline-gap-tight": string;
    "cell-padding": string;
};

export type SkeletonTokens = {
    radius: string;
    height: string;
    width: string;
    "cell-h": string;
    "list-gap": string;
};

export type TypographyTokens = {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
};

export type InputTokens = {
    radius: string;
    height: string;
    "padding-x": string;
    "padding-y": string;
    gap: string;
    text: string;
    "label-text": string;
    "hint-text": string;
    "label-mb": string;
    "hint-mt": string;
    inline: string;
    "slot-gap": string;
    "slot-pl": string;
    "slot-pr": string;
};

export type CheckboxTokens = {
    size: string;
    radius: string;
    gap: string;
    "hint-text": string;
};

export type RadioboxTokens = {
    size: string;
    gap: string;
};

export type SwitchTokens = {
    "track-h": string;
    "track-w": string;
    "thumb-size": string;
    gap: string;
    "label-text": string;
    "hint-text": string;
    "hint-mt": string;
};

export type SliderTokens = {
    "control-h": string;
    "track-h": string;
    "thumb-size": string;
};

export type FileUploadTokens = {
    p: string;
    radius: string;
    gap: string;
    "thumb-size": string;
    "text-name": string;
    "text-size": string;
    "delete-py": string;
    "inner-gap": string;
    "thumb-my": string;
    "thumb-gap": string;
};

export type ProgressTokens = {
    "track-h": string;
};

export type SpinnerTokens = {
    size: string;
    border: string;
    "container-p": string;
};

export type EmptyTokens = {
    gap: string;
    px: string;
    py: string;
};

export type ListTokens = {
    radius: string;
    "card-p": string;
    "card-py": string;
    "card-pb": string;
    "card-gap": string;
    "close-p": string;
    "header-gap": string;
    "item-py": string;
    "item-gap": string;
    "avatar-px": string;
    "body-py": string;
    "title-text": string;
};

export type TimelineTokens = {
    "item-pb": string;
    "connector-left": string;
    "connector-top": string;
    "connector-w": string;
    "icon-size": string;
    "icon-p": string;
    "right-gap": string;
    "right-px": string;
};

export type StepTokens = {
    size: string;
    "icon-size": string;
    "label-px": string;
    gap: string;
    "connector-h": string;
};

export type TabsTokens = {
    "header-mb": string;
    "item-px": string;
    "item-py": string;
    "divider-h": string;
};

export type ShortcutTokens = {
    gap: string;
    text: string;
};

export type ToolbarTokens = {
    bottom: string;
    radius: string;
    p: string;
};

export type WizardTokens = {
    w: string;
    gap: string;
    radius: string;
    p: string;
    "footer-pt": string;
    "actions-gap": string;
    "counter-right": string;
    "counter-top": string;
    "label-text": string;
};

export type InfoTokens = {
    gap: string;
    "label-text": string;
    "value-text": string;
    "secondary-text": string;
};

export type PageCalendarTokens = {
    gap: string;
    "header-gap": string;
    "date-gap": string;
    "badge-size": string;
    "badge-radius": string;
    "title-text": string;
    "week-label-text": string;
    "nav-gap": string;
    "nav-btn-gap": string;
    "today-radius": string;
    "today-px": string;
    "today-py": string;
    "today-text": string;
    "view-switch-radius": string;
    "filter-gap": string;
    "filter-text": string;
    "dot-size": string;
    "dot-bottom": string;
    "day-header-gap": string;
    "day-header-px": string;
    "day-header-py": string;
    "day-badge-size": string;
    "gutter-w": string;
    "side-px": string;
    "detail-gap": string;
    "detail-p": string;
    "weekday-py": string;
    "weekday-text": string;
    "cell-min-h": string;
    "cell-gap": string;
    "cell-p": string;
    "month-badge-size": string;
    "month-badge-text": string;
    "overflow-text": string;
    "week-badge-size": string;
    "week-badge-text": string;
    "hour-text": string;
    "pill-radius": string;
    "pill-text": string;
    "cell-gap-tight": string;
    "nav-mr": string;
};

export type ComponentTokens = {
    card: CardTokens;
    button: ButtonTokens;
    alert: AlertTokens;
    modal: ModalTokens;
    dropdown: DropdownTokens;
    tooltip: TooltipTokens;
    menu: MenuTokens;
    stats: StatsTokens;
    notification: NotificationTokens;
    command: CommandTokens;
    tag: TagTokens;
    calendar: CalendarTokens;
    table: TableTokens;
    skeleton: SkeletonTokens;
    typography: TypographyTokens;
    input: InputTokens;
    checkbox: CheckboxTokens;
    radiobox: RadioboxTokens;
    switch: SwitchTokens;
    slider: SliderTokens;
    "file-upload": FileUploadTokens;
    progress: ProgressTokens;
    spinner: SpinnerTokens;
    empty: EmptyTokens;
    list: ListTokens;
    timeline: TimelineTokens;
    step: StepTokens;
    tabs: TabsTokens;
    shortcut: ShortcutTokens;
    toolbar: ToolbarTokens;
    wizard: WizardTokens;
    info: InfoTokens;
    "page-calendar": PageCalendarTokens;
    custom?: Record<string, Record<string, string>>;
};

export type DesignTokens = {
    name: string;
    zIndex: ZIndex;
    shadow: Record<`shadow-${Shadows}`, string>;
    spacing: Record<"base" | "lg" | "sm" | "hairline", string> & {
        dialog: string;
    };
    rounded: Record<"full" | "pill", string>;
    components: ComponentTokens;
    custom?: Record<string, string>;
    colors: {
        border: string;
        disabled: string;
        background: string;
        foreground: string;
        muted: BasicTokens;
        primary: BasicTokens;
        emphasis: BasicTokens;
        tooltip: ComponentToken;
        floating: ComponentToken;
        info: BasicTokens & { notification: string };
        warn: BasicTokens & { notification: string };
        danger: BasicTokens & { notification: string };
        secondary: BasicTokens & { background: string };
        success: BasicTokens & { notification: string };
        tag: Record<ThemeState, { text: string; bg: string }>;
        button: Record<ThemeState, { text: string; bg: string }>;
        card: { background: string; border: string; muted: string };
        table: { border: string; header: string; background: string };
        alert: Record<ThemeState, { text: string; bg: string; border: string }>;
        ring?: string;
        input: {
            border: string;
            placeholder: string;
            "mask-error": string;
            "switch-bg": string;
            switch: string;
            slider: string;
        };
    };
};

export type Token = { key: string; value: string };

export type DesignTokensParser =
    | ((value: string, key: string, combine: string) => string)
    | ((format: string) => (value: string, key: string, combine: string) => string);

export type DesignTokensBuilder = (value: string, key: string, combine: string) => Token;

type Fn = (...a: never[]) => unknown;

export type DeepParse<T extends GeneralTokens, F extends Fn> = {
    [K in keyof T]: T[K] extends GeneralTokens ? DeepParse<T[K], F> : ReturnType<Fn>;
};
