import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { PropsWithChildren } from "react";

type TileProps = {
    /** Unique, prefixed `showcase-` so it never clashes with ids on docs pages. */
    id: string;
    title: string;
    /** The documentation page of the main component the tile shows. */
    href: string;
    className?: string;
};

/** One live composition: a labelled region with a link to the docs of the component it shows. */
export const Tile = ({ id, title, href, className = "", children }: PropsWithChildren<TileProps>) => (
    <section id={id} className={`landing-tile ${className}`} aria-labelledby={`${id}-title`}>
        <header className="landing-tile-head">
            <h3 id={`${id}-title`}>{title}</h3>
            <Link href={href} aria-label={`${title}: read the docs`}>
                Docs
                <ArrowUpRightIcon size={13} aria-hidden="true" />
            </Link>
        </header>
        <div className="landing-tile-body">{children}</div>
    </section>
);
