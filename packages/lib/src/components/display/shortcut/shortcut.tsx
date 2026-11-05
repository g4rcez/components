import { CommandIcon, OptionIcon } from "@phosphor-icons/react";
import { Fragment, useSyncExternalStore } from "react";
import { isMac } from "../../../lib/combi-keys";
import { shortcutStyles } from "./shortcut.styles";

const noopSubscribe = () => () => {};

// The server cannot read navigator.userAgent, so hydration renders the non-Mac keys and then switches.
const useIsMac = () => useSyncExternalStore(noopSubscribe, isMac, () => false);

const remap = (x: string, mac: boolean) => {
    x = x.trim();
    if (x === "Alt") return mac ? <OptionIcon aria-label="Option" className={shortcutStyles.slots.icon} /> : "Alt";
    if (x === "Mod") return mac ? <CommandIcon aria-label="Command" className={shortcutStyles.slots.icon} /> : "Ctrl";
    return x;
};

export const Shortcut = (props: { value: string }) => {
    const mac = useIsMac();
    const p = props.value.trim().split("+");
    return (
        <span className={shortcutStyles.className({})}>
            {p.map((x, i) => {
                const isLast = p.length - 1 === i;
                return (
                    <Fragment key={`${props.value}-${x}-key-${i}`}>
                        <kbd aria-label={x}>{remap(x, mac)}</kbd>
                        {isLast ? null : <span>+</span>}
                    </Fragment>
                );
            })}
        </span>
    );
};
