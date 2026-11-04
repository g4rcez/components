"use client";

import { forwardRef, type VideoHTMLAttributes } from "react";
import { css } from "../../../lib/dom";
import { videoPlayerStyles } from "./video-player.styles";

export interface VideoPlayerTrack {
    src: string;
    kind: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
    srcLang?: string;
    label?: string;
    default?: boolean;
}

export interface VideoPlayerProps extends Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "children" | "src" | "controls" | "aria-label" | "dangerouslySetInnerHTML"
> {
    /** A meaningful name for the video and its browser-provided controls. */
    label: string;
    src: string;
    tracks?: readonly VideoPlayerTrack[];
    fallback?: string;
}

/** Browser-owned playback, seeking, volume, captions and fullscreen controls. */
export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(function VideoPlayer(
    { label, src, tracks = [], fallback = "Your browser cannot play this video.", className, preload = "metadata", playsInline = true, ...props },
    ref
) {
    return (
        <video
            {...props}
            ref={ref}
            data-component="video-player"
            className={css(videoPlayerStyles.className({}), className)}
            aria-label={label}
            src={src}
            controls
            preload={preload}
            playsInline={playsInline}
        >
            {tracks.map((track) => (
                <track key={`${track.kind}:${track.src}:${track.srcLang ?? ""}`} {...track} />
            ))}
            {fallback}
        </video>
    );
});
