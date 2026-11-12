"use client";
import {
    ActionSwap,
    Button,
    Calendar,
    CardStack,
    HoldToConfirm,
    MorphSelect,
    Progress,
    Reactions,
    RenderOnView,
    RollingDigits,
    Shortcut,
    Slider,
    Spinner,
    Stats,
    Switch,
    Tag,
    TaskList,
    Timeline,
    TimelineItem,
    useNotification,
    type MorphSelectItem,
    type ReactionOption,
} from "@g4rcez/components";
import {
    BellIcon,
    CheckIcon,
    FireIcon,
    GitCommitIcon,
    HeartIcon,
    MagnifyingGlassIcon,
    PaperPlaneTiltIcon,
    RocketLaunchIcon,
    SpeakerHighIcon,
    SpeakerNoneIcon,
    ThumbsUpIcon,
    UsersIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { OPEN_SEARCH_EVENT } from "../header";

const languages: MorphSelectItem[] = [
    { value: "pt", label: "Português", meta: "pt-BR" },
    { value: "en", label: "English", meta: "en-US" },
    { value: "es", label: "Español", meta: "es-ES" },
    { value: "fr", label: "Français", meta: "fr-FR" },
    { value: "de", label: "Deutsch", meta: "de-DE" },
];

export const SettingsTile = () => (
    <div className="landing-stack">
        <MorphSelect label="Language" items={languages} defaultValue="en" panelWidth={240} />
        <Switch name="showcase-email" defaultChecked>
            Email notifications
        </Switch>
        <Switch name="showcase-digest">Weekly digest</Switch>
    </div>
);

const reactionOptions: ReactionOption[] = [
    { id: "up", label: "Thumbs up", icon: ThumbsUpIcon },
    { id: "heart", label: "Heart", icon: HeartIcon },
    { id: "fire", label: "Fire", icon: FireIcon },
    { id: "ship", label: "Shipped", icon: RocketLaunchIcon },
];

export const ReactionsTile = () => (
    <div className="landing-stack">
        <p className="landing-message">
            <strong>Release 7.1</strong> is out: six new components, an elastic slider and a docs site with a real search.
        </p>
        <Reactions
            options={reactionOptions}
            label="Reactions to the release"
            defaultValue={[
                { id: "up", count: 24, reacted: false },
                { id: "ship", count: 9, reacted: true },
            ]}
        />
    </div>
);

type City = { id: string; name: string; country: string; hue: number };

const cities: City[] = [
    { id: "lisbon", name: "Lisbon", country: "Portugal", hue: 28 },
    { id: "copenhagen", name: "Copenhagen", country: "Denmark", hue: 200 },
    { id: "kyoto", name: "Kyoto", country: "Japan", hue: 140 },
    { id: "porto", name: "Porto", country: "Portugal", hue: 350 },
];

export const CardStackTile = () => (
    <RenderOnView className="landing-stack-host">
        <CardStack
            items={cities}
            label="Cities to shortlist"
            getKey={(city) => city.id}
            getLabel={(city) => city.name}
            labels={{ left: "Skip", right: "Keep" }}
            outcomes={{ left: "skipped", right: "kept" }}
            renderCard={(city) => (
                <div
                    className="landing-city"
                    style={{ background: `linear-gradient(160deg, hsl(${city.hue} 55% 90%), hsl(${city.hue} 45% 76%))`, color: "hsl(0 0% 12%)" }}
                >
                    <span>{city.country}</span>
                    <strong>{city.name}</strong>
                </div>
            )}
        />
    </RenderOnView>
);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const DeployTile = () => (
    <div className="landing-stack">
        <div className="landing-row">
            <span className="landing-label">production</span>
            <Tag theme="success" appearance="soft" size="tiny">
                Healthy
            </Tag>
        </div>
        <ActionSwap
            states={[
                { id: "deploy", label: "Deploy", icon: <RocketLaunchIcon aria-hidden weight="bold" />, tone: "primary", pendingLabel: "Deploying" },
                { id: "deployed", label: "Deployed", icon: <CheckIcon aria-hidden weight="bold" />, tone: "success", holdFor: 2200 },
            ]}
            onAction={() => wait(1100)}
        />
        <ActionSwap
            size="sm"
            states={[
                { id: "follow", label: "Follow", icon: <PaperPlaneTiltIcon aria-hidden weight="bold" />, tone: "neutral" },
                { id: "following", label: "Following", icon: <CheckIcon aria-hidden weight="bold" />, tone: "quiet" },
            ]}
        />
    </div>
);

export const DangerTile = () => (
    <div className="landing-stack">
        <p className="landing-muted">Deleting the project removes its deployments and keys. Press and hold to confirm.</p>
        <HoldToConfirm label="Hold to delete project" confirmedLabel="Project deleted" onConfirm={() => undefined} />
    </div>
);

export const SliderTile = () => {
    const [volume, setVolume] = useState<readonly number[]>([40]);
    return (
        <div className="landing-stack">
            <div className="landing-row">
                <span className="landing-label">Volume</span>
                <span className="landing-figure">
                    <RollingDigits value={volume[0]} />%
                </span>
            </div>
            <Slider
                label="Volume"
                tooltip
                value={volume}
                marks={[0, 50, 100]}
                onValueChange={(next) => setVolume(Array.isArray(next) ? next : [next as number])}
                formatValue={(value) => `${value}%`}
                startIcon={<SpeakerNoneIcon aria-hidden size={18} />}
                endIcon={<SpeakerHighIcon aria-hidden size={18} />}
            />
        </div>
    );
};

export const StatsTile = () => {
    const [users, setUsers] = useState(1284);
    useEffect(() => {
        const id = window.setInterval(() => setUsers((value) => value + 1 + Math.floor(Math.random() * 4)), 2600);
        return () => window.clearInterval(id);
    }, []);
    return (
        <div className="landing-stack">
            <Stats title="Active users" Icon={UsersIcon}>
                <RollingDigits value={users} />
            </Stats>
        </div>
    );
};

export const UploadTile = () => (
    <div className="landing-stack">
        <div className="landing-row">
            <span className="landing-label">design-system.zip</span>
            <Tag theme="info" appearance="soft" size="tiny">
                Uploading
            </Tag>
        </div>
        <Progress value={72} label="Upload" />
        <div className="landing-row landing-muted">
            <Spinner />
            <span>36 MB of 50 MB</span>
        </div>
    </div>
);

export const TimelineTile = () => (
    <Timeline>
        {[
            { id: "a", title: "Release 7.1.0", text: "Published to npm" },
            { id: "b", title: "Docs rebuilt", text: "Search and generated API tables" },
            { id: "c", title: "Slider upgraded", text: "Elastic stretch and detents" },
        ].map((event) => (
            <TimelineItem key={event.id}>
                <TimelineItem.Icon>
                    <GitCommitIcon size={18} aria-hidden />
                </TimelineItem.Icon>
                <TimelineItem.Body>
                    <strong>{event.title}</strong>
                    <p className="landing-muted">{event.text}</p>
                </TimelineItem.Body>
            </TimelineItem>
        ))}
    </Timeline>
);

export const TasksTile = () => (
    <TaskList className="landing-stack">
        <legend className="landing-label">Sprint tasks</legend>
        {["Write the migration guide", "Review the new tokens", "Ship the docs"].map((task, index) => (
            <label key={task} className="landing-check">
                <input type="checkbox" data-task defaultChecked={index === 0} />
                {task}
            </label>
        ))}
    </TaskList>
);

export const CalendarTile = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
        <RenderOnView>
            <Calendar date={date} changeOnlyOnClick onChange={setDate} />
        </RenderOnView>
    );
};

export const SearchTile = () => {
    const notify = useNotification();
    return (
        <div className="landing-stack">
            <p className="landing-muted">Find any component, prop or example from anywhere in the docs.</p>
            <div className="landing-row">
                <Button theme="neutral" size="small" onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}>
                    <MagnifyingGlassIcon size={16} aria-hidden="true" />
                    Open search
                </Button>
                <Shortcut value="Mod + K" />
            </div>
            <Button theme="ghost-primary" size="small" onClick={() => notify("Deployed to production", { theme: "success" })}>
                <BellIcon size={16} aria-hidden="true" />
                Show a toast
            </Button>
        </div>
    );
};
