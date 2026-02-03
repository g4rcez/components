import { CommandIcon, OptionIcon } from "lucide-react";
import { Fragment } from "react";
import { isMac } from "../../lib/combi-keys";

const remap = (x: string) => {
    x = x.trim();
    if (x === "Alt") return isMac() ? <OptionIcon aria-label="Option" size={12} /> : "Alt";
    if (x === "Mod") return isMac() ? <CommandIcon aria-label="Command" size={12} /> : "Ctrl";
    return x;
};

export const Shortcut = (props: { value: string }) => {
    const p = props.value.trim().split("+");
    return (
        <span className="flex text-sm items-center gap-1">
            {p.map((x, i) => {
                const isLast = p.length - 1 === i;
                return (
                    <Fragment key={`${props.value}-${x}-key-${i}`}>
                        <kbd aria-label={x}>{remap(x)}</kbd>
                        {isLast ? null : <span>+</span>}
                    </Fragment>
                );
            })}
        </span>
    );
};
