"use client";
import {
    ChartBarIcon,
    CheckCircleIcon,
    ListBulletsIcon,
    MagnifyingGlassIcon,
    RocketLaunchIcon,
    SparkleIcon,
    UploadIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
    Alert,
    AnimatedList,
    AnimatedListItem,
    Button,
    Calendar,
    Card,
    Empty,
    Info,
    Loading,
    PageCalendar,
    Progress,
    Spinner,
    Stats,
    StatsCard,
    Step,
    Steps,
    Tab,
    Tabs,
    Tag,
    Timeline,
    TimelineItem,
    Toolbar,
    Shortcut,
    Checkbox,
    Input,
    Radiobox,
    Slider,
    Switch,
    Skeleton,
} from "../../../../../lib/src";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import {
    mergeTokenDefaults,
    pickTokenDefaults,
    TokenControls as Controls,
    tokenGroupDefaults,
    tokensToStyle as toStyle,
} from "@/components/editable-tokens";

const alertDefaults = tokenGroupDefaults("alert");
const statsDefaults = tokenGroupDefaults("stats");
const typographyDefaults = tokenGroupDefaults("typography");
const inputDefaults = tokenGroupDefaults("input");
const selectionDefaults = mergeTokenDefaults("checkbox", "switch");
const skeletonDefaults = tokenGroupDefaults("skeleton");
const progressDefaults = tokenGroupDefaults("progress");
const spinnerDefaults = tokenGroupDefaults("spinner");
const emptyDefaults = tokenGroupDefaults("empty");
const listDefaults = tokenGroupDefaults("list");
const timelineDefaults = tokenGroupDefaults("timeline");
const stepDefaults = tokenGroupDefaults("step");
const tabsDefaults = tokenGroupDefaults("tabs");
const shortcutDefaults = tokenGroupDefaults("shortcut");
const toolbarDefaults = tokenGroupDefaults("toolbar");
const wizardDefaults = tokenGroupDefaults("wizard");
const infoDefaults = tokenGroupDefaults("info");
const pageCalendarDefaults = tokenGroupDefaults("page-calendar");
const cardStatsDefaults = pickTokenDefaults("card", ["stats-icon-col-w", "stats-icon-col-p", "stats-content-gap", "stats-content-py"]);
const buttonDefaults = tokenGroupDefaults("button");
const cardDefaults = tokenGroupDefaults("card");
const modalDefaults = tokenGroupDefaults("modal");
const dropdownDefaults = tokenGroupDefaults("dropdown");
const tooltipDefaults = tokenGroupDefaults("tooltip");
const menuDefaults = tokenGroupDefaults("menu");
const notificationDefaults = tokenGroupDefaults("notification");
const commandDefaults = tokenGroupDefaults("command");
const calendarDefaults = tokenGroupDefaults("calendar");
const tableDefaults = tokenGroupDefaults("table");
const radioboxDefaults = tokenGroupDefaults("radiobox");
const sliderDefaults = tokenGroupDefaults("slider");
const fileUploadDefaults = tokenGroupDefaults("file-upload");
const tagDefaults = tokenGroupDefaults("tag");
const tokenStackClassName = "flex w-full flex-col gap-6";

export default function DesignTokensPage() {
    const [alertTokens, setAlertTokens] = useState(alertDefaults);
    const [statsTokens, setStatsTokens] = useState(statsDefaults);
    const [typographyTokens, setTypographyTokens] = useState(typographyDefaults);
    const [skeletonTokens, setSkeletonTokens] = useState(skeletonDefaults);
    const [inputTokens, setInputTokens] = useState(inputDefaults);
    const [selectionTokens, setSelectionTokens] = useState(selectionDefaults);
    const [progressTokens, setProgressTokens] = useState(progressDefaults);
    const [spinnerTokens, setSpinnerTokens] = useState(spinnerDefaults);
    const [emptyTokens, setEmptyTokens] = useState(emptyDefaults);
    const [listTokens, setListTokens] = useState(listDefaults);
    const [timelineTokens, setTimelineTokens] = useState(timelineDefaults);
    const [stepTokens, setStepTokens] = useState(stepDefaults);
    const [tabsTokens, setTabsTokens] = useState(tabsDefaults);
    const [shortcutTokens, setShortcutTokens] = useState(shortcutDefaults);
    const [toolbarTokens, setToolbarTokens] = useState(toolbarDefaults);
    const [wizardTokens, setWizardTokens] = useState(wizardDefaults);
    const [infoTokens, setInfoTokens] = useState(infoDefaults);
    const [pageCalendarTokens, setPageCalendarTokens] = useState(pageCalendarDefaults);
    const [cardStatsTokens, setCardStatsTokens] = useState(cardStatsDefaults);
    const [buttonTokens, setButtonTokens] = useState(buttonDefaults);
    const [cardTokens, setCardTokens] = useState(cardDefaults);
    const [modalTokens, setModalTokens] = useState(modalDefaults);
    const [dropdownTokens, setDropdownTokens] = useState(dropdownDefaults);
    const [tooltipTokens, setTooltipTokens] = useState(tooltipDefaults);
    const [menuTokens, setMenuTokens] = useState(menuDefaults);
    const [notificationTokens, setNotificationTokens] = useState(notificationDefaults);
    const [commandTokens, setCommandTokens] = useState(commandDefaults);
    const [calendarTokens, setCalendarTokens] = useState(calendarDefaults);
    const [tableTokens, setTableTokens] = useState(tableDefaults);
    const [radioboxTokens, setRadioboxTokens] = useState(radioboxDefaults);
    const [sliderTokens, setSliderTokens] = useState(sliderDefaults);
    const [fileUploadTokens, setFileUploadTokens] = useState(fileUploadDefaults);
    const [tagTokens, setTagTokens] = useState(tagDefaults);
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
    const [sliderValue, setSliderValue] = useState(40);

    return (
        <DocsLayout
            title="Design Tokens"
            section="theming"
            description="Per-component CSS variables exposed as Tailwind utilities. Override --component-attr on any container to reskin geometry without touching markup."
        >
            <div className="flex flex-col gap-10">
                <ComponentDemo
                    title="Alert tokens"
                    description="Padding, radius and inner gap are owned by --alert-p, --alert-radius and --alert-gap. Use the controls to override the full alert token group on this scoped container."
                    code={`<div style={{ "--alert-p": "24px", "--alert-radius": "16px", "--alert-gap": "12px" }}>
  <Alert theme="info" title="Token override">
    <p>Padding, radius and gap come from CSS variables.</p>
  </Alert>
</div>`}
                >
                    <div style={toStyle(alertTokens)} className={tokenStackClassName}>
                        <Alert theme="info" title="Token override">
                            <p>Padding, radius and gap come from CSS variables.</p>
                        </Alert>
                        <Controls tokens={alertTokens} onChange={setAlertTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Stats tokens"
                    description="--stats-radius, --stats-p, --stats-gap, --stats-icon-size and --stats-icon-p drive layout independently of color tokens."
                    code={`<div style={{ "--stats-radius": "20px", "--stats-p": "32px", "--stats-icon-size": "56px" }}>
  <Stats title="Revenue" Icon={ChartBarIcon}>$12,480</Stats>
</div>`}
                >
                    <div style={toStyle(statsTokens)} className={tokenStackClassName}>
                        <Stats
                            title="Revenue"
                            Icon={ChartBarIcon}
                            footer={<span className="text-sm text-muted-foreground">+12.4% vs last month</span>}
                        >
                            $12,480
                        </Stats>
                        <Controls tokens={statsTokens} onChange={setStatsTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Typography tokens"
                    description="text-xs, text-2xl and text-4xl previously fell back to Tailwind defaults. They now resolve to --typography-xs, --typography-2xl, --typography-4xl."
                    code={`<div style={{ "--typography-2xl": "2rem", "--typography-4xl": "3rem" }}>
  <p className="text-xs">Caption</p>
  <h3 className="text-2xl">Section heading</h3>
  <h1 className="text-4xl">Display</h1>
</div>`}
                >
                    <div style={toStyle(typographyTokens)} className={tokenStackClassName}>
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-muted-foreground">Caption / text-xs</p>
                            <p className="text-sm">Small / text-sm</p>
                            <p className="text-base">Body / text-base</p>
                            <p className="text-lg">Lead / text-lg</p>
                            <h3 className="text-2xl font-bold">Section heading / text-2xl</h3>
                            <h1 className="text-4xl font-extrabold">Display / text-4xl</h1>
                            <h1 className="text-5xl font-extrabold">Hero / text-5xl</h1>
                        </div>
                        <Controls tokens={typographyTokens} onChange={setTypographyTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Skeleton tokens"
                    description="Default skeleton dimensions and stack rhythm flow from --skeleton-height, --skeleton-width, --skeleton-radius and --skeleton-list-gap."
                    code={`<div style={{ "--skeleton-height": "48px", "--skeleton-radius": "12px" }}>
  <Skeleton />
</div>`}
                >
                    <div style={toStyle(skeletonTokens)} className={tokenStackClassName}>
                        <div className="flex w-full flex-col items-center gap-skeleton-list-gap">
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </div>
                        <Controls tokens={skeletonTokens} onChange={setSkeletonTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Input tokens"
                    description="The shared --input-* group drives geometry for every text-like field: input, textarea, select, autocomplete, multi-select and date-picker."
                    code={`<div style={{ "--input-radius": "12px", "--input-padding-x": "12px" }}>
  <Input title="Email" name="email" placeholder="you@example.com" />
</div>`}
                >
                    <div style={toStyle(inputTokens)} className={tokenStackClassName}>
                        <Input title="Email" name="email" placeholder="you@example.com" error="Override the tokens to reshape this field." />
                        <Controls tokens={inputTokens} onChange={setInputTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Selection tokens"
                    description="Checkbox and switch geometry, plus checkbox control colors, come from editable CSS variables. Use the controls to re-skin them live."
                    code={`<div style={{ "--checkbox-size": "20px", "--switch-track-w": "56px" }}>
  <Checkbox>Subscribe</Checkbox>
  <Switch>Notifications</Switch>
</div>`}
                >
                    <div style={toStyle(selectionTokens)} className={tokenStackClassName}>
                        <div className="flex flex-col gap-3">
                            <Checkbox>Subscribe to updates</Checkbox>
                            <Switch>Notifications</Switch>
                        </div>
                        <Controls tokens={selectionTokens} onChange={setSelectionTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Progress tokens"
                    description="Track height and corner shape come from --progress-track-h and --progress-radius. Override them to reskin every Progress bar without touching markup."
                    code={`<div style={{ "--progress-track-h": "2rem", "--progress-radius": "8px" }}>
  <Progress value={60} />
</div>`}
                >
                    <div style={toStyle(progressTokens)} className={tokenStackClassName}>
                        <Progress value={60} />
                        <Controls tokens={progressTokens} onChange={setProgressTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Spinner tokens"
                    description="--var-spinner-indicator-size, --var-spinner-indicator-border-width and --var-spinner-container-padding drive the spinner geometry and the Loading wrapper padding."
                    code={`<div style={{ "--var-spinner-indicator-size": "5rem", "--var-spinner-indicator-border-width": "0.5rem" }}>
  <Loading />
</div>`}
                >
                    <div style={toStyle(spinnerTokens)} className={tokenStackClassName}>
                        <div className="flex w-full items-center justify-center">
                            <Spinner />
                        </div>
                        <Loading />
                        <Controls tokens={spinnerTokens} onChange={setSpinnerTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Empty tokens"
                    description="The empty-state placeholder geometry resolves through --empty-gap, --empty-px and --empty-py."
                    code={`<div style={{ "--empty-py": "4rem" }}>
  <Empty Icon={ListBulletsIcon} message="Nothing here yet" />
</div>`}
                >
                    <div style={toStyle(emptyTokens)} className={tokenStackClassName}>
                        <Empty Icon={ListBulletsIcon} message="Nothing here yet" />
                        <Controls tokens={emptyTokens} onChange={setEmptyTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="List tokens"
                    description="AnimatedList row rhythm and the floating card padding resolve through --list-card-p, --list-card-gap, --list-item-py and --list-item-gap."
                    code={`<div style={{ "--list-item-py": "1rem" }}>
  <AnimatedList>
    <AnimatedListItem title="Title" description="Description">Body</AnimatedListItem>
  </AnimatedList>
</div>`}
                >
                    <div style={toStyle(listTokens)} className={tokenStackClassName}>
                        <AnimatedList>
                            <AnimatedListItem title="Quarterly review" description="Open the card to read the full agenda.">
                                Body content goes here when expanded.
                            </AnimatedListItem>
                            <AnimatedListItem title="Marketing sync" description="Status update across the campaign workstreams.">
                                Body content goes here when expanded.
                            </AnimatedListItem>
                        </AnimatedList>
                        <Controls tokens={listTokens} onChange={setListTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Timeline tokens"
                    description="Item rhythm, connector placement, connector width and icon dimensions resolve through semantic timeline tokens."
                    code={`<div style={{ "--timeline-icon-size": "4rem", "--timeline-content-gap": "1rem" }}>
  <Timeline>
    <TimelineItem>Event</TimelineItem>
  </Timeline>
</div>`}
                >
                    <div style={toStyle(timelineTokens)} className={tokenStackClassName}>
                        <Timeline>
                            <TimelineItem>
                                <div className="flex flex-col">
                                    <strong>Shipped v1</strong>
                                    <span className="text-typography-sm text-muted-foreground">Initial release rolled out to all customers.</span>
                                </div>
                            </TimelineItem>
                            <TimelineItem>
                                <div className="flex flex-col">
                                    <strong>Public beta</strong>
                                    <span className="text-typography-sm text-muted-foreground">Opened the waitlist to the broader audience.</span>
                                </div>
                            </TimelineItem>
                        </Timeline>
                        <Controls tokens={timelineTokens} onChange={setTimelineTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Step tokens"
                    description="Step indicator geometry resolves through --step-size, --step-icon-size and --step-gap (gap is owned by the Steps wrapper)."
                    code={`<div style={{ "--step-size": "3rem" }}>
  <Steps steps={3} currentStep={2}>
    <Step step={1} currentStep={2} title="Plan" />
  </Steps>
</div>`}
                >
                    <div style={toStyle(stepTokens)} className={tokenStackClassName}>
                        <Steps steps={3} currentStep={2}>
                            <Step step={1} currentStep={2} title="Plan" />
                            <Step step={2} currentStep={2} title="Build" />
                            <Step step={3} currentStep={2} title="Ship" />
                        </Steps>
                        <Controls tokens={stepTokens} onChange={setStepTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Tabs tokens"
                    description="Tab header rhythm comes from semantic tab padding, divider, and header margin tokens."
                    code={`<div style={{ "--tabs-tab-padding-inline": "4rem" }}>
  <Tabs active="one"><Tab id="one" title="One">Content</Tab></Tabs>
</div>`}
                >
                    <div style={toStyle(tabsTokens)} className={tokenStackClassName}>
                        <Tabs active="overview">
                            <Tab id="overview" title="Overview">
                                <p>Overview panel.</p>
                            </Tab>
                            <Tab id="activity" title="Activity">
                                <p>Activity panel.</p>
                            </Tab>
                            <Tab id="settings" title="Settings">
                                <p>Settings panel.</p>
                            </Tab>
                        </Tabs>
                        <Controls tokens={tabsTokens} onChange={setTabsTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Shortcut tokens"
                    description="Key separator rhythm and label size flow from --shortcut-gap and --shortcut-text."
                    code={`<div style={{ "--shortcut-gap": "0.5rem" }}>
  <Shortcut value="ctrl+k" />
</div>`}
                >
                    <div style={toStyle(shortcutTokens)} className={tokenStackClassName}>
                        <div className="flex flex-wrap items-center gap-4">
                            <Shortcut value="ctrl+k" />
                            <Shortcut value="shift+enter" />
                            <Shortcut value="cmd+shift+p" />
                        </div>
                        <Controls tokens={shortcutTokens} onChange={setShortcutTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Toolbar tokens"
                    description="Floating toolbar offset, corner radius and padding come from --toolbar-bottom, --toolbar-radius and --toolbar-p."
                    code={`<div style={{ "--toolbar-p": "1.5rem" }}>
  <Toolbar><button>Action</button></Toolbar>
</div>`}
                >
                    <div style={toStyle(toolbarTokens)} className={tokenStackClassName}>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border border-card-border">
                            <Toolbar>
                                <button type="button" className="text-typography-sm rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
                                    Save
                                </button>
                                <button type="button" className="text-typography-sm rounded-md border border-card-border px-3 py-1.5">
                                    Discard
                                </button>
                            </Toolbar>
                        </div>
                        <Controls tokens={toolbarTokens} onChange={setToolbarTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Wizard tokens"
                    description="Wizard surface dimensions resolve through --wizard-w, --wizard-gap, --wizard-radius and --wizard-p. Demo renders a static surface using the same skin classes."
                    code={`<div style={{ "--wizard-w": "24rem", "--wizard-radius": "1rem" }}>
  {/* Wizard renders its floating surface with these tokens */}
</div>`}
                >
                    <div style={toStyle(wizardTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="flex w-wizard-w flex-col gap-wizard-gap rounded-wizard-radius border border-card-border bg-card-background p-wizard-p shadow-shadow-card">
                            <RocketLaunchIcon size={28} />
                            <h3 className="text-typography-lg font-semibold">Welcome to the workspace</h3>
                            <p className="text-typography-sm text-muted-foreground">Walk through the basics in three short steps.</p>
                            <footer className="flex items-center justify-end gap-wizard-actions-gap pt-wizard-footer-pt">
                                <button type="button" className="text-wizard-label-text text-muted-foreground">
                                    Skip
                                </button>
                                <button type="button" className="text-typography-sm rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
                                    Next
                                </button>
                            </footer>
                        </div>
                        <Controls tokens={wizardTokens} onChange={setWizardTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Info tokens"
                    description="Label/value/secondary text and inner gap resolve through --info-gap, --info-label-text, --info-value-text and --info-secondary-text."
                    code={`<div style={{ "--info-label-text": "1rem" }}>
  <Info label="Name">Fulano</Info>
</div>`}
                >
                    <div style={toStyle(infoTokens)} className={tokenStackClassName}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Info label="Customer">Fulano</Info>
                            <Info row label="Plan">
                                Enterprise
                            </Info>
                            <Info label="Renewal date">
                                <span>March 14, 2026</span>
                            </Info>
                            <Info row label="Status">
                                Active
                            </Info>
                        </div>
                        <Controls tokens={infoTokens} onChange={setInfoTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Page calendar tokens"
                    description="Full-page calendar surface — badges, cells, gutter and pills resolve through the complete --page-calendar-* token group."
                    code={`<div style={{ "--page-calendar-cell-min-block-size": "10rem" }}>
  <PageCalendar events={events} />
</div>`}
                >
                    <div style={toStyle(pageCalendarTokens)} className={tokenStackClassName}>
                        <PageCalendar
                            events={[
                                {
                                    id: "kickoff",
                                    title: "Kickoff",
                                    date: new Date(),
                                },
                                {
                                    id: "review",
                                    title: "Quarterly review",
                                    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
                                },
                            ]}
                        />
                        <Controls tokens={pageCalendarTokens} onChange={setPageCalendarTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Card stats extras"
                    description="StatsCard icon column width and padding resolve through --card-stats-icon-col-w and --card-stats-icon-col-p."
                    code={`<div style={{ "--card-stats-icon-col-w": "8rem" }}>
  <StatsCard title="Revenue" Icon={ChartBarIcon}>$12,480</StatsCard>
</div>`}
                >
                    <div style={toStyle(cardStatsTokens)} className={tokenStackClassName}>
                        <StatsCard title="Revenue" Icon={ChartBarIcon} value="$12,480" />
                        <Controls tokens={cardStatsTokens} onChange={setCardStatsTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Button tokens"
                    description="Button height, radius, horizontal padding and icon/text gap come from --button-height, --button-radius, --button-padding-x and --button-gap."
                    code={`<div style={{ "--button-radius": "1rem", "--button-height": "3rem" }}>
  <Button theme="primary">Save changes</Button>
</div>`}
                >
                    <div style={toStyle(buttonTokens)} className={tokenStackClassName}>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button theme="primary">Primary</Button>
                            <Button theme="secondary">Secondary</Button>
                            <Button theme="danger">Danger</Button>
                            <Button theme="muted">
                                <SparkleIcon size={16} aria-hidden />
                                With icon
                            </Button>
                        </div>
                        <Controls tokens={buttonTokens} onChange={setButtonTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Card tokens"
                    description="Card geometry resolves through --card-radius, --card-padding-x, --card-padding-y and --card-gap."
                    code={`<div style={{ "--card-radius": "1.5rem", "--card-padding-x": "2rem" }}>
  <Card title="Workspace"><p>Body</p></Card>
</div>`}
                >
                    <div style={toStyle(cardTokens)} className={tokenStackClassName}>
                        <Card title="Workspace">
                            <p className="text-typography-sm text-muted-foreground">Card padding, radius and stack gap come from CSS variables.</p>
                        </Card>
                        <Controls tokens={cardTokens} onChange={setCardTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Modal tokens"
                    description="Modal surface geometry resolves through --modal-surface-radius, --modal-content-padding-inline, --modal-surface-padding-block and --modal-confirm-actions-gap. The demo shows a static surface using the same skin classes."
                    code={`<div style={{ "--modal-surface-radius": "1rem", "--modal-content-padding-inline": "2.5rem" }}>
  <Modal type="dialog" trigger={<button>Open</button>}>...</Modal>
</div>`}
                >
                    <div style={toStyle(modalTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="w-full max-w-dialog rounded-modal-surface-radius border border-floating-border bg-floating-background px-modal-content-padding-inline py-modal-surface-padding-block shadow-shadow-floating">
                            <header className="pb-modal-title-padding-block-end text-typography-xl font-semibold">Confirm deployment</header>
                            <p className="text-typography-sm py-modal-body-padding-block text-muted-foreground">
                                Override `--modal-surface-radius` and `--modal-content-padding-inline` on a scoped container to reshape every Modal
                                surface.
                            </p>
                            <footer className="flex justify-end gap-modal-confirm-actions-gap pt-modal-footer-padding-block-start">
                                <button type="button" className="text-typography-sm rounded-button-radius border border-card-border px-3 py-1.5">
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="text-typography-sm rounded-button-radius bg-primary px-3 py-1.5 text-primary-foreground"
                                >
                                    Confirm
                                </button>
                            </footer>
                        </div>
                        <Controls tokens={modalTokens} onChange={setModalTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Dropdown tokens"
                    description="Floating dropdown surface uses --dropdown-surface-radius, --dropdown-surface-padding and --dropdown-header-margin-block-end."
                    code={`<div style={{ "--dropdown-surface-radius": "0.75rem" }}>
  <Dropdown header="Header">...</Dropdown>
</div>`}
                >
                    <div style={toStyle(dropdownTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="w-full max-w-xs rounded-dropdown-surface-radius border border-dropdown-surface-border bg-dropdown-surface-background p-dropdown-surface-padding text-dropdown-surface-foreground shadow-shadow-floating">
                            <header className="text-typography-sm mb-dropdown-header-margin-block-end font-semibold">Account</header>
                            <ul className="text-typography-sm flex flex-col gap-1">
                                <li>Profile</li>
                                <li>Workspace settings</li>
                                <li className="text-danger">Sign out</li>
                            </ul>
                        </div>
                        <Controls tokens={dropdownTokens} onChange={setDropdownTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Tooltip tokens"
                    description="Tooltip surface resolves through --tooltip-surface-radius and --tooltip-surface-padding."
                    code={`<div style={{ "--tooltip-surface-radius": "0.75rem", "--tooltip-surface-padding": "1rem" }}>
  <Tooltip title="Tip">Hover me</Tooltip>
</div>`}
                >
                    <div style={toStyle(tooltipTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="rounded-tooltip-surface-radius bg-tooltip-surface-background p-tooltip-surface-padding text-tooltip-surface-foreground shadow-shadow-floating">
                            <p className="text-typography-sm">Override the tokens to reshape every tooltip.</p>
                        </div>
                        <Controls tokens={tooltipTokens} onChange={setTooltipTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Menu tokens"
                    description="Floating Menu surface uses --menu-surface-radius and --menu-item-padding."
                    code={`<div style={{ "--menu-surface-radius": "1rem" }}>
  <Menu options={[{ label: "Item" }]}>Open</Menu>
</div>`}
                >
                    <div style={toStyle(menuTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="w-full max-w-xs rounded-menu-surface-radius border border-menu-surface-border bg-menu-surface-background text-menu-surface-foreground shadow-shadow-floating">
                            <ul className="flex flex-col">
                                <li className="text-typography-sm p-menu-item-padding hover:bg-menu-item-active-background hover:text-menu-item-active-foreground">
                                    Duplicate
                                </li>
                                <li className="text-typography-sm p-menu-item-padding hover:bg-menu-item-active-background hover:text-menu-item-active-foreground">
                                    Archive
                                </li>
                                <li className="text-typography-sm p-menu-item-padding text-danger hover:bg-menu-item-active-background hover:text-menu-item-active-foreground">
                                    Delete
                                </li>
                            </ul>
                        </div>
                        <Controls tokens={menuTokens} onChange={setMenuTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Notification tokens"
                    description="Toast geometry resolves through --notification-radius, --notification-p and --notification-gap."
                    code={`<div style={{ "--notification-radius": "1rem", "--notification-p": "1.25rem" }}>
  <Notifications>...</Notifications>
</div>`}
                >
                    <div style={toStyle(notificationTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="flex w-full max-w-sm items-start gap-notification-gap rounded-notification-radius border border-success-subtle bg-success-subtle p-notification-p text-success-foreground shadow-shadow-notification">
                            <CheckCircleIcon size={24} aria-hidden />
                            <div className="flex flex-col gap-notification-inner-gap">
                                <strong className="text-typography-sm">Deploy succeeded</strong>
                                <span className="text-typography-xs">main → production · 12s ago</span>
                            </div>
                        </div>
                        <Controls tokens={notificationTokens} onChange={setNotificationTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Command palette tokens"
                    description="Command surface resolves through --command-radius, --command-item-p and --command-row-h."
                    code={`<div style={{ "--command-radius": "1rem", "--command-row-h": "3rem" }}>
  <CommandPalette items={items} />
</div>`}
                >
                    <div style={toStyle(commandTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="w-full max-w-md overflow-hidden rounded-command-radius border border-floating-border bg-floating-background shadow-shadow-floating">
                            <div className="flex h-command-header-h items-center gap-2 px-command-input-px py-command-input-py">
                                <MagnifyingGlassIcon size={16} aria-hidden />
                                <span className="text-typography-sm text-muted-foreground">Search the workspace…</span>
                            </div>
                            <ul className="flex flex-col gap-command-list-gap px-command-list-px py-command-list-my">
                                <li className="text-typography-sm flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p hover:bg-floating-hover">
                                    Create deployment
                                </li>
                                <li className="text-typography-sm flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p hover:bg-floating-hover">
                                    Invite teammate
                                </li>
                                <li className="text-typography-sm flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p hover:bg-floating-hover">
                                    Open settings
                                </li>
                            </ul>
                        </div>
                        <Controls tokens={commandTokens} onChange={setCommandTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Calendar tokens"
                    description="Inline Calendar geometry uses --calendar-day-size, --calendar-cell-p and --calendar-weekday-py."
                    code={`<div style={{ "--calendar-day-size": "3rem" }}>
  <Calendar date={date} onChange={setDate} />
</div>`}
                >
                    <div style={toStyle(calendarTokens)} className="flex w-full flex-col items-center gap-6">
                        <Calendar date={calendarDate} changeOnlyOnClick onChange={setCalendarDate} />
                        <Controls tokens={calendarTokens} onChange={setCalendarTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Table tokens"
                    description="Table geometry resolves through semantic table radius, cell padding, row rhythm, metadata and pagination tokens."
                    code={`<div style={{ "--table-rounded": "1rem", "--table-cell-padding": "1rem" }}>
  <Table cols={cols} rows={rows} />
</div>`}
                >
                    <div style={toStyle(tableTokens)} className={tokenStackClassName}>
                        <div className="overflow-hidden rounded-table-rounded border border-table-border bg-table-background shadow-shadow-table">
                            <table className="w-full border-collapse">
                                <thead className="bg-table-header">
                                    <tr>
                                        <th className="text-typography-sm p-table-cell-padding text-left">Name</th>
                                        <th className="text-typography-sm p-table-cell-padding text-left">Role</th>
                                        <th className="text-typography-sm p-table-cell-padding text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-table-border">
                                        <td className="text-typography-sm p-table-cell-padding px-table-cell-padding-inline">Fulano</td>
                                        <td className="text-typography-sm p-table-cell-padding px-table-cell-padding-inline">Owner</td>
                                        <td className="text-typography-sm p-table-cell-padding px-table-cell-padding-inline">Active</td>
                                    </tr>
                                    <tr className="border-t border-table-border">
                                        <td className="text-typography-sm p-table-cell-padding px-table-cell-padding-inline">Ciclano</td>
                                        <td className="text-typography-sm p-table-cell-padding px-table-cell-padding-inline">Member</td>
                                        <td className="text-typography-sm p-table-cell-padding px-table-cell-padding-inline">Invited</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Controls tokens={tableTokens} onChange={setTableTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Radiobox tokens"
                    description="Radiobox geometry resolves through --radiobox-size and --radiobox-gap."
                    code={`<div style={{ "--radiobox-size": "1.25rem" }}>
  <Radiobox name="plan" value="pro">Pro</Radiobox>
</div>`}
                >
                    <div style={toStyle(radioboxTokens)} className={tokenStackClassName}>
                        <div className="flex flex-col gap-2">
                            <Radiobox name="dt-plan" value="free" defaultChecked>
                                Free
                            </Radiobox>
                            <Radiobox name="dt-plan" value="pro">
                                Pro
                            </Radiobox>
                            <Radiobox name="dt-plan" value="enterprise">
                                Enterprise
                            </Radiobox>
                        </div>
                        <Controls tokens={radioboxTokens} onChange={setRadioboxTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Slider tokens"
                    description="Slider geometry resolves through --slider-control-h, --slider-track-h and --slider-thumb-size."
                    code={`<div style={{ "--slider-thumb-size": "1.5rem" }}>
  <Slider value={[40]} />
</div>`}
                >
                    <div style={toStyle(sliderTokens)} className={tokenStackClassName}>
                        <Slider value={[sliderValue]} onValueChange={(v) => setSliderValue(Array.isArray(v) ? Number(v[0]) : Number(v))} />
                        <Controls tokens={sliderTokens} onChange={setSliderTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="File upload tokens"
                    description="Dropzone geometry resolves through --file-upload-p, --file-upload-radius, --file-upload-thumb-size, --file-upload-thumb-radius, --file-upload-thumb-icon-size and friends."
                    code={`<div style={{ "--file-upload-thumb-icon-size": "2rem" }}>
  <FileUpload onDrop={...} />
</div>`}
                >
                    <div style={toStyle(fileUploadTokens)} className="flex w-full flex-col items-center gap-6">
                        <div className="flex w-full flex-col items-center gap-file-upload-gap rounded-file-upload-radius border-2 border-dashed border-input-border bg-card-background p-file-upload-p text-center">
                            <span
                                className="flex size-file-upload-thumb-size items-center justify-center bg-muted text-muted-foreground"
                                style={{ borderRadius: "var(--file-upload-thumb-radius)" }}
                            >
                                <UploadIcon className="__file-upload__thumb-icon" aria-hidden />
                            </span>
                            <strong className="text-file-upload-text-name">Drop files here</strong>
                            <span className="text-file-upload-text-size text-muted-foreground">PNG, JPG or PDF up to 10 MB</span>
                        </div>
                        <Controls tokens={fileUploadTokens} onChange={setFileUploadTokens} />
                    </div>
                </ComponentDemo>

                <ComponentDemo
                    title="Tag tokens"
                    description="Tag size variants are token-backed by semantic surface, padding, typography and indicator tokens that respond to scoped overrides."
                    code={`<div style={{ "--tag-default-min-block-size": "3rem", "--tag-default-padding-inline": "1.5rem" }}>
  <Tag>Default</Tag>
</div>`}
                >
                    <div style={toStyle(tagTokens)} className={tokenStackClassName}>
                        <div className="flex w-full flex-wrap items-center justify-center gap-4">
                            <Tag size="tiny">tiny</Tag>
                            <Tag size="small">small</Tag>
                            <Tag>default</Tag>
                            <Tag size="big">big</Tag>
                        </div>
                        <Controls tokens={tagTokens} onChange={setTagTokens} />
                    </div>
                </ComponentDemo>
            </div>
        </DocsLayout>
    );
}
