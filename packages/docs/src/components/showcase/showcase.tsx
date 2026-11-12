"use client";
import { Tile } from "./tile";
import {
    CalendarTile,
    CardStackTile,
    DangerTile,
    DeployTile,
    ReactionsTile,
    SearchTile,
    SettingsTile,
    SliderTile,
    StatsTile,
    TasksTile,
    TimelineTile,
    UploadTile,
} from "./tiles";

/** A dense grid of real library compositions: the library demonstrating itself. */
export const Showcase = () => (
    <div className="landing-showcase">
        <Tile id="showcase-settings" title="Settings" href="/docs/morph-select">
            <SettingsTile />
        </Tile>
        <Tile id="showcase-cards" title="Triage" href="/docs/card-stack" className="landing-tile-tall">
            <CardStackTile />
        </Tile>
        <Tile id="showcase-reactions" title="Reactions" href="/docs/reactions">
            <ReactionsTile />
        </Tile>
        <Tile id="showcase-deploy" title="Actions" href="/docs/action-swap">
            <DeployTile />
        </Tile>
        <Tile id="showcase-danger" title="Danger zone" href="/docs/hold-to-confirm">
            <DangerTile />
        </Tile>
        <Tile id="showcase-slider" title="Slider" href="/docs/slider">
            <SliderTile />
        </Tile>
        <Tile id="showcase-calendar" title="Calendar" href="/docs/calendar" className="landing-tile-wide">
            <CalendarTile />
        </Tile>
        <Tile id="showcase-stats" title="Metrics" href="/docs/stats">
            <StatsTile />
        </Tile>
        <Tile id="showcase-upload" title="Progress" href="/docs/progress">
            <UploadTile />
        </Tile>
        <Tile id="showcase-timeline" title="Activity" href="/docs/timeline">
            <TimelineTile />
        </Tile>
        <Tile id="showcase-tasks" title="Tasks" href="/docs/task-list">
            <TasksTile />
        </Tile>
        <Tile id="showcase-search" title="Search" href="/docs/commander" className="landing-tile-wide">
            <SearchTile />
        </Tile>
    </div>
);
