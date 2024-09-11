import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";

export const Navbar = () => {
  return (
    <header className="bg-neutral-900 text-white">
      <nav className="container flex items-center justify-between w-full mx-auto py-2">
        <h1>components</h1>
        <ul className="items-center flex gap-4">
          <ToggleMode />
          <a
            href="https://github.com/g4rcez/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="fill-white text-white size-6 aspect-square" />
          </a>
        </ul>
      </nav>
    </header>
  );
};
