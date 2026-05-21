"use client";
import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";
import { ListIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "../../../lib/src/components/floating/modal";
import { usePrevious } from "../../../lib/src/hooks/use-previous";
import { Navigation } from "./navigation";


export const Header = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const prevPathname = usePrevious(pathname);

    useEffect(() => {
        if (prevPathname && prevPathname !== pathname) {
            setOpen(false);
        }
    }, [pathname, prevPathname]);

    return (
        <header className="sticky top-0 z-20 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-8xl mx-auto flex h-[var(--header-height)] items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setOpen(true)}
                        className="-ml-2 p-2 text-muted-foreground hover:text-foreground lg:hidden"
                    >
                        <ListIcon className="size-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">C</div>
                        <span className="hidden text-lg font-bold tracking-tight sm:inline-block">Components</span>
                    </Link>
                    <nav className="ml-8 hidden items-center gap-6 md:flex">
                        <Link
                            href="/docs/get-started"
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/docs") ? "text-primary" : "text-muted-foreground"}`}
                        >
                            Docs
                        </Link>
                        <Link href="/docs/buttons" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            Components
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 border-r border-border pr-4">
                        <ToggleMode />
                        <a
                            href="https://github.com/g4rcez/components"
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <GithubIcon className="size-5 fill-current" />
                        </a>
                    </div>

                    <div className="hidden sm:block">
                        <span className="font-mono text-xs tracking-tighter text-muted-foreground">v2.3.0</span>
                    </div>
                </div>
            </div>

            <Modal closable open={open} title="Menu" overlayClickClose onChange={setOpen} className="lg:hidden">
                <div className="px-2 py-6">
                    <Navigation />
                </div>
            </Modal>
        </header>
    );
};
