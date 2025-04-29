"use client";
import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";
import { MenuIcon } from "lucide-react";
import { Modal } from "../../../lib/src/components/floating/modal";
import { Navigation } from "./navigation";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePrevious } from "../../../lib/src/hooks/use-previous";
import Link from "next/link";

const Title = (
  <Link href="/">
    <h2>UI</h2>
  </Link>
);

export const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const prevPathname = usePrevious(pathname);

  useEffect(() => {
    if (prevPathname) {
      if (prevPathname !== pathname) setOpen(false);
    }
  }, [pathname, prevPathname, open]);

  return (
    <header className="sticky z-navbar border-b border-card-border shadow-xs top-0 bg-card-background [grid-area:header] bg-card-background/50 h-14 flex items-center px-4 lg:px-8 backdrop-blur-lg">
      <Modal
        closable
        open={open}
        title={Title}
        overlayClickClose
        onChange={setOpen}
      >
        <Navigation />
      </Modal>
      <nav className="flex items-center justify-between w-full py-2">
        {Title}
        <ul className="items-center flex gap-4">
          <ToggleMode />
          <a
            href="https://github.com/g4rcez/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="fill-foreground text-foreground size-6 aspect-square" />
          </a>
          <button onClick={() => setOpen(true)}>
            <span className="sr-only">Open menu</span>
            <MenuIcon className="fill-foreground text-foreground size-6 aspect-square" />
          </button>
        </ul>
      </nav>
    </header>
  );
};
