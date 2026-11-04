---
title: VideoPlayer
description: Responsive video playback with accessible browser-owned controls and caption tracks.
package: "@g4rcez/components"
export: "{ VideoPlayer, type VideoPlayerProps, type VideoPlayerTrack }"
import: "import { VideoPlayer } from '@g4rcez/components/video-player'"
category: display
---

# VideoPlayer

Use `VideoPlayer` for uploaded or hosted video. The browser owns playback, seeking, audio, playback speed, captions and fullscreen; no replacement controls or player dependency are required. Codec support depends on the browser. This component does not transcode, upload or authorize media.

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

- `src: string` and `label: string` are required. Label names the video and its native controls for assistive technology.
- `tracks?: readonly VideoPlayerTrack[]` renders standard WebVTT tracks: `src`, `kind`, optional `srcLang`, `label` and `default`. Provide captions for speech and meaningful audio; descriptions or a nearby transcript may be needed for visual information.
- Standard React video attributes/events, including `poster`, `muted`, `loop`, `onError`, `onLoadedMetadata` and `onTimeUpdate`, are supported. The forwarded ref is the actual `HTMLVideoElement`.
- Controls are always enabled. `preload` defaults to `"metadata"`; `playsInline` defaults to `true`. Playback never starts automatically unless the caller explicitly sets `autoPlay`.
- `fallback?: string` is text for browsers without the video element. Network and decoding errors are reported through native `onError`; use the application’s library feedback surface to display recovery actions.
- `className` styles the video root. Children and raw HTML injection are intentionally not accepted.

## CSS and security

Import foundation before `video-player.css`; there are no component CSS dependencies. Public root selector: `.__video-player`, also identified by `data-component="video-player"`. It reads canonical `--var-color-muted`, `--var-color-foreground`, `--var-color-border`, `--var-color-ring` and `--var-radius-base` tokens.

Serve authenticated media from the application’s authorized endpoint, or supply an owned object URL and revoke it when no longer used. Only pass sources the application intends to load: the player follows browser media fetching and CORS rules and does not turn arbitrary remote URLs into trusted content. A browser can reject a valid container with an unsupported codec; provide a download option when appropriate. Do not autoplay audible media or omit captions for meaningful audio.
