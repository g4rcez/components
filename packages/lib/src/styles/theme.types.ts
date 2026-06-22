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
    rounded: string;
    "padding-x": string;
    "padding-y": string;
    gap: string;
    "title-pb": string;
    "title-mb": string;
    "stats-icon-col-w": string;
    "stats-icon-col-p": string;
    "stats-icon-size": string;
    "stats-content-gap": string;
    "stats-content-py": string;
    "title-text": string;
};

export type ButtonTokens = {
    rounded: string;
    height: string;
    "padding-x": string;
    "padding-y": string;
    gap: string;
    text: string;
    "height-big": string;
    "padding-x-big": string;
    "padding-y-big": string;
    "text-big": string;
    "height-small": string;
    "padding-x-small": string;
    "padding-y-small": string;
    "text-small": string;
    "height-min": string;
    "padding-x-min": string;
    "padding-y-min": string;
    "text-min": string;
    "height-tiny": string;
    "padding-x-tiny": string;
    "padding-y-tiny": string;
    "text-tiny": string;
    "padding-icon": string;
    "text-icon": string;
    "radius-rough": string;
    "radius-squared": string;
};

export type AlertTokens = {
    rounded: string;
    p: string;
    gap: string;
    "close-top": string;
    "close-right": string;
};

export type ModalTokens = {
    "surface-min-inline-size": string;
    "surface-gap": string;
    "surface-radius": string;
    "surface-padding-block": string;
    "dialog-max-inline-size-mobile": string;
    "dialog-max-block-size": string;
    "sheet-max-block-size": string;
    "sheet-padding-block-start": string;
    "sheet-padding-block-end": string;
    "resizer-radius": string;
    "focus-outline-offset": string;
    "resizer-focus-ring-width": string;
    "sheet-handle-inset-block-start": string;
    "sheet-handle-block-size": string;
    "sheet-handle-padding-block": string;
    "drawer-resizer-inset-inline": string;
    "drawer-resizer-inset-inline-start": string;
    "drawer-resizer-block-size": string;
    "drawer-resizer-inline-size": string;
    "sheet-pill-block-size": string;
    "sheet-pill-inline-size": string;
    "overlay-block-size": string;
    "overlay-padding-block-start": string;
    "content-padding-inline": string;
    "title-padding-block-end": string;
    "title-font-size": string;
    "title-line-height": string;
    "body-padding-block": string;
    "footer-padding-block-start": string;
    "close-inset-inline-end": string;
    "close-inset-block-start": string;
    "close-button-padding": string;
    "close-button-opacity": string;
    "transition-duration": string;
    "transition-timing": string;
    "close-focus-ring-width": string;
    "close-icon-size": string;
    "confirm-dialog-max-inline-size": string;
    "confirm-actions-gap": string;
    "confirm-description-padding-block": string;
    "overlay-background": string;
};

export type DropdownTokens = {
    "surface-radius": string;
    "surface-padding": string;
    "header-margin-block-end": string;
    "title-font-size": string;
    "title-letter-spacing": string;
    "list-max-block-size": string;
    "surface-background": string;
    "surface-border": string;
    "surface-foreground": string;
};

export type ExpandTokens = Record<string, never>;

export type TooltipTokens = {
    "surface-radius": string;
    "surface-padding": string;
    "surface-background": string;
    "surface-foreground": string;
    "surface-border": string;
};

export type MenuTokens = {
    "surface-radius": string;
    "surface-max-block-size": string;
    "surface-background": string;
    "surface-border": string;
    "surface-foreground": string;
    "item-padding": string;
    "item-min-inline-size": string;
    "item-outline-width": string;
    "item-outline-offset": string;
    "item-expanded-opacity": string;
    "item-disabled-opacity": string;
    "item-active-background": string;
    "item-active-foreground": string;
    "nested-indicator-margin-inline-start": string;
    "nested-indicator-font-size": string;
    "nested-icon-size": string;
    "item-icon-size": string;
};

export type StatsTokens = {
    rounded: string;
    p: string;
    gap: string;
    "icon-size": string;
    "icon-p": string;
    "inner-gap": string;
    "footer-px": string;
    "footer-py": string;
    "title-text": string;
    "value-text": string;
};

export type NotificationTokens = {
    rounded: string;
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
    rounded: string;
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
    "surface-gap": string;
    "surface-radius": string;
    "default-min-block-size": string;
    "default-padding-inline": string;
    "default-padding-block": string;
    "big-min-block-size": string;
    "big-padding-inline": string;
    "big-padding-block": string;
    "small-min-block-size": string;
    "small-padding-inline": string;
    "small-padding-block": string;
    "small-font-size": string;
    "tiny-min-block-size": string;
    "tiny-padding-inline": string;
    "tiny-padding-block": string;
    "tiny-font-size": string;
    "icon-padding": string;
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
    rounded: string;
    "groups-gap": string;
    "inline-gap-tight": string;
    "filter-gap": string;
    "filter-row-gap": string;
    "filter-inline-gap": string;
    "filter-inline-padding-block": string;
    "filter-list-margin-block-start": string;
    "groups-margin-block-start": string;
    "groups-margin-block": string;
    "row-gap": string;
    "row-padding-block-end": string;
    "cell-padding": string;
    "cell-padding-inline": string;
    "cell-border": string;
    "head-cell-block-size": string;
    "divider-width": string;
    "pagination-padding": string;
    "pagination-gap": string;
    "pagination-items-gap": string;
    "pagination-item-padding-inline": string;
    "pagination-item-padding-block": string;
    "metadata-margin-block-end": string;
    "metadata-gap-inline": string;
    "metadata-gap-block": string;
    "metadata-min-inline-size": string;
    "operations-padding-block": string;
    "operations-gap": string;
    "pill-radius": string;
    "pill-padding-inline": string;
    "pill-padding-block": string;
    "filter-dot-size": string;
    "filter-dot-margin-inline-end": string;
    "loading-block-size": string;
    "loading-bar-block-size": string;
    "loading-bar-radius": string;
    "empty-block-size": string;
};

export type SkeletonTokens = {
    rounded: string;
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
    rounded: string;
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
    rounded: string;
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
    rounded: string;
    gap: string;
    "thumb-size": string;
    "thumb-radius": string;
    "thumb-icon-size": string;
    "text-name": string;
    "text-size": string;
    "delete-py": string;
    "inner-gap": string;
    "thumb-my": string;
    "thumb-gap": string;
};

export type ProgressTokens = {
    "track-h": string;
    rounded: string;
};

export type SpinnerTokens = {
    "indicator-size": string;
    "indicator-border-width": string;
    "container-padding": string;
    "spin-duration": string;
};

export type EmptyTokens = {
    gap: string;
    px: string;
    py: string;
};

export type ListTokens = {
    rounded: string;
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
    "item-padding-block-end": string;
    "connector-inset-inline-start": string;
    "connector-inset-block-start": string;
    "connector-inline-size": string;
    "content-gap": string;
    "icon-size": string;
    "icon-padding": string;
    "actions-gap": string;
    "actions-padding-inline": string;
};

export type StepTokens = {
    size: string;
    "icon-size": string;
    "label-px": string;
    gap: string;
    "connector-h": string;
};

export type TabsTokens = {
    "header-margin-block-end": string;
    "tab-padding-inline": string;
    "tab-padding-block": string;
    "divider-block-size": string;
    "active-divider-block-size": string;
    "item-transition-duration": string;
};

export type ShortcutTokens = {
    gap: string;
    text: string;
};

export type ToolbarTokens = {
    bottom: string;
    rounded: string;
    p: string;
};

export type WizardTokens = {
    w: string;
    gap: string;
    rounded: string;
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
    "nav-button-gap": string;
    "today-radius": string;
    "today-padding-inline": string;
    "today-padding-block": string;
    "today-font-size": string;
    "view-switch-radius": string;
    "filter-gap": string;
    "filter-font-size": string;
    "dot-size": string;
    "dot-bottom": string;
    "day-header-gap": string;
    "day-header-padding-inline": string;
    "day-header-padding-block": string;
    "day-badge-size": string;
    "gutter-width": string;
    "side-padding-inline": string;
    "detail-gap": string;
    "detail-padding": string;
    "weekday-padding-block": string;
    "weekday-font-size": string;
    "cell-min-block-size": string;
    "cell-gap": string;
    "cell-padding": string;
    "month-badge-size": string;
    "month-badge-font-size": string;
    "overflow-font-size": string;
    "week-badge-size": string;
    "week-badge-font-size": string;
    "hour-font-size": string;
    "pill-radius": string;
    "pill-font-size": string;
    "cell-gap-tight": string;
    "filter-label-margin-inline-end": string;
};

export type ComponentTokens = {
    card: CardTokens;
    button: ButtonTokens;
    alert: AlertTokens;
    modal: ModalTokens;
    dropdown: DropdownTokens;
    expand: ExpandTokens;
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
