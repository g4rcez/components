"use client";
import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";
import { ListIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../lib/src";
import { Modal } from "../../../lib/src/components/floating/modal";
import { usePrevious } from "../../../lib/src/hooks/use-previous";
import { Navigation } from "./navigation";

const Brand = () => (
  <Link
    href="/"
    className="flex items-center gap-3 group transition-all duration-500"
  >
    <div className="size-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs shadow-xl shadow-foreground/5 group-hover:scale-110 transition-transform">
      C
    </div>
    <span className="text-lg font-semibold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
      Library
    </span>
  </Link>
);

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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-[var(--header-height)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 lg:hidden text-muted-foreground hover:text-foreground"
          >
            <ListIcon className="size-6" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              C
            </div>
            <span className="hidden sm:inline-block text-lg font-bold tracking-tight">
              Components
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <Link
              href="/docs/get-started"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/docs") ? "text-primary" : "text-muted-foreground"}`}
            >
              Docs
            </Link>
            <Link
              href="/docs/buttons"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
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
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="size-5 fill-current" />
            </a>
          </div>

          <div className="hidden sm:block">
            <span className="text-xs font-mono text-muted-foreground tracking-tighter">
              v2.3.0
            </span>
          </div>
        </div>
      </div>

      <Modal
        closable
        open={open}
        title="Menu"
        overlayClickClose
        onChange={setOpen}
        className="lg:hidden"
      >
        <div className="px-2 py-6">
          <Navigation />
        </div>
      </Modal>
    </header>
  );
};
