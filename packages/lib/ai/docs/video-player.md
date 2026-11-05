---
title: VideoPlayer
description: Responsive video playback with accessible browser-owned controls and caption tracks.
package: "@g4rcez/components"
export: "{ VideoPlayer, type VideoPlayerProps, type VideoPlayerTrack }"
import: "import { VideoPlayer } from '@g4rcez/components/video-player'"
category: display
---

# VideoPlayer

Use `VideoPlayer` for uploaded or hosted video. The browser owns playback, seeking, audio, speed, captions and fullscreen. Codec support depends on the browser. The component does not transcode, upload or authorize media.

```tsx
import { VideoPlayer } from "@g4rcez/components/video-player";
import "@g4rcez/components/foundation.css";
import "@g4rcez/components/video-player.css";

<VideoPlayer
    src="/media/intro.webm"
    label="Workspace introduction"
    tracks={[{ src: "/media/intro.en.vtt", kind: "captions", srcLang: "en", label: "English", default: true }]}
/>
```

## API

- `src: string` and `label: string` are required. `label` names the video and its native controls for assistive technology.
- `tracks?: readonly VideoPlayerTrack[]` renders WebVTT tracks: `src`, `kind`, optional `srcLang`, `label` and `default`.
- Add captions for speech and meaningful audio. Add descriptions or a nearby transcript for visual information.
- React video attributes and events work, including `poster`, `muted`, `loop`, `onError`, `onLoadedMetadata` and `onTimeUpdate`.
- The forwarded ref is the `HTMLVideoElement`.
- Controls are always enabled. `preload` defaults to `"metadata"`. `playsInline` defaults to `true`.
- Playback starts automatically only when the caller sets `autoPlay`.
- `fallback?: string` is text for browsers without the video element.
- Native `onError` reports network and decoding errors. Show recovery actions with the application's library feedback surface.
- `className` styles the video root. Children and raw HTML injection are not accepted.

## CSS and security

- Import foundation before `video-player.css`. The component has no CSS dependencies.
- Root selector: `.__video-player`, also `data-component="video-player"`.
- The CSS reads `--var-color-muted`, `--var-color-foreground`, `--var-color-border`, `--var-color-ring` and `--var-radius-base`.
- Serve authenticated media from the application's authorized endpoint, or supply an owned object URL and revoke it after use.
- Pass only sources the application intends to load. The player follows browser fetching and CORS rules and does not make remote URLs trusted.
- When the browser rejects a valid container codec, provide a download option.
- Do not autoplay audible media. Do not omit captions for meaningful audio.
