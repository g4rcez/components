"use client";
import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";
import { BookOpenIcon, MenuIcon, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "../../../lib/src/components/floating/modal";
import { usePrevious } from "../../../lib/src/hooks/use-previous";
import { Navigation } from "./navigation";

const Brand = () => (
  <Link href="/" className="flex gap-3 items-center group">
    <div className="relative">
      <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-br rounded-lg shadow-lg transition-all duration-300 from-primary via-primary/90 to-primary/70 group-hover:shadow-primary/25">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="absolute -inset-1 bg-gradient-to-br rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 from-primary/20 to-primary/10 blur" />
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">
        Components
      </span>
      <span className="mt-0.5 text-xs leading-none text-muted-foreground">
        Modern React Library
      </span>
    </div>
  </Link>
);

export const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const prevPathname = usePrevious(pathname);
  const isLandingPage = pathname === "/";

  useEffect(() => {
    if (prevPathname) {
      if (prevPathname !== pathname) setOpen(false);
    }
  }, [pathname, prevPathname, open]);

  return (
    <header className="flex fixed w-[calc(100%-var(--sidebar-width))] top-0 z-50 justify-between border-b shadow-sm h-[var(--header-height)] bg-card-background/70 backdrop-blur-md border-card-border/50">
      <Modal
        closable
        open={open}
        title={<Brand />}
        overlayClickClose
        onChange={setOpen}
      >
        <Navigation />
      </Modal>
      <div className="flex justify-between w-full items-center px-4 lg:px-6 h-[var(--header-height)]">
        <Brand />
        <div className="flex gap-3 items-center">
          <nav className="hidden gap-1 items-center sm:flex">
            <Link
              href="/docs/get-started"
              className="flex gap-2 items-center py-1.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-card-background/50"
            >
              <BookOpenIcon className="size-5" />
              Get Started
            </Link>
          </nav>

          <div className="flex gap-4 items-center pl-4 border-l border-card-border/50">
            <ToggleMode />
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              href="https://github.com/g4rcez/components"
              className="p-2 rounded-lg transition-all duration-200 text-foreground hover:bg-card-background/50"
            >
              <GithubIcon className="size-5 fill-foreground text-foreground" />
            </a>
            {!isLandingPage && (
              <button
                onClick={() => setOpen(true)}
                aria-label="Open navigation menu"
                className="p-2 rounded-lg transition-all duration-200 lg:hidden text-muted-foreground hover:text-foreground hover:bg-card-background/50"
              >
                <MenuIcon className="size-5 text-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
