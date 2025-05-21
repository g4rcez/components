import React from "react";

type EventKey =
    | "Backspace"
    | "Tab"
    | "Enter"
    | "Shift"
    | "Control"
    | "Alt"
    | "Pause"
    | "CapsLock"
    | "Escape"
    | "Space"
    | "PageUp"
    | "PageDown"
    | "End"
    | "Home"
    | "ArrowLeft"
    | "ArrowUp"
    | "ArrowRight"
    | "ArrowDown"
    | "PrintScreen"
    | "Insert"
    | "Delete"
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z"
    | "Meta"
    | "ContextMenu"
    | "F1"
    | "F2"
    | "F3"
    | "F4"
    | "F5"
    | "F6"
    | "F7"
    | "F8"
    | "F9"
    | "F10"
    | "F11"
    | "F12"
    | "NumLock"
    | "ScrollLock"
    | "AudioVolumeMute"
    | "AudioVolumeUp"
    | "AudioVolumeDown"
    | "MediaTrackNext"
    | "MediaTrackPrevious"
    | "MediaStop"
    | "MediaPlayPause"
    | "LaunchMail"
    | "LaunchMediaPlayer"
    | "LaunchApplication1"
    | "LaunchApplication2"
    | "Semicolon"
    | "Equal"
    | "Comma"
    | "Minus"
    | "Period"
    | "Slash"
    | "Backquote"
    | "BracketLeft"
    | "Backslash"
    | "BracketRight"
    | "Quote";

export const keyboardKeys = {
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
} as const;

type Callback<T extends HTMLElement = HTMLElement> = (e: KeyboardEvent | React.KeyboardEvent<T>) => void;

export class KeyboardArea<T extends HTMLElement> {
    private set = new Set();

    public key(key: EventKey, callback: Callback<T>) {
        const fn: Callback<T> = (e) => (e.key === key ? callback(e) : undefined);
        return () => this.set.delete(fn);
    }

    public onKeyDown(_: Callback<T>) {}
}
