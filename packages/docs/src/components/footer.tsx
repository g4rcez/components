import Link from "next/link";
import { GithubIcon } from "./icons/github";

const footerLinks = {
  Documentation: [
    { name: "Get Started", href: "/docs/get-started" },
    { name: "Components", href: "/docs" },
    { name: "Examples", href: "/docs/examples" },
    { name: "API Reference", href: "/docs/api" },
  ],
  Resources: [
    { name: "GitHub", href: "https://github.com/g4rcez/components" },
    {
      name: "NPM Package",
      href: "https://www.npmjs.com/package/@g4rcez/components",
    },
    { name: "Changelog", href: "/docs/changelog" },
    { name: "Contributing", href: "/docs/contributing" },
  ],
  Community: [
    { name: "Issues", href: "https://github.com/g4rcez/components/issues" },
    {
      name: "Discussions",
      href: "https://github.com/g4rcez/components/discussions",
    },
  ],
};

export const Footer = () => {
  return (
    <footer>
      <div className="py-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold">
              @g4rcez/components
            </Link>
            <p className="mt-4 text-sm text-foreground/70">
              A comprehensive React component library built with TypeScript,
              Tailwind CSS, and modern web technologies.
            </p>
            <div className="flex gap-4 items-center mt-6">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                href="https://github.com/g4rcez/components"
              >
                <GithubIcon className="size-6 fill-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
