import Link from "next/link";
import { GithubIcon } from "./icons/github";

const footerLinks = {
    Documentation: [
        { name: "Introduction", href: "/docs" },
        { name: "Get started", href: "/docs/get-started" },
        { name: "Components", href: "/docs/buttons" },
        { name: "Theming", href: "/docs/setup" },
    ],
    Resources: [
        { name: "GitHub", href: "https://github.com/g4rcez/components" },
        { name: "NPM package", href: "https://www.npmjs.com/package/@g4rcez/components" },
        { name: "Releases", href: "https://github.com/g4rcez/components/releases" },
    ],
    Community: [
        { name: "Issues", href: "https://github.com/g4rcez/components/issues" },
        { name: "Discussions", href: "https://github.com/g4rcez/components/discussions" },
    ],
};

export const Footer = () => (
    <footer className="site-footer">
        <div className="site-footer-brand">
            <Link href="/" className="docs-brand">
                <span className="docs-brand-mark" aria-hidden="true">
                    C
                </span>
                <span>@g4rcez/components</span>
            </Link>
            <p>
                React components for interfaces
                <br />
                that feel like yours.
            </p>
            <a
                href="https://github.com/g4rcez/components"
                target="_blank"
                rel="noreferrer"
                className="docs-icon-button"
                aria-label="View components on GitHub"
            >
                <GithubIcon className="docs-github-icon" aria-hidden="true" />
            </a>
        </div>
        {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={category}>
                <h2>{category}</h2>
                <ul>
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                target={link.href.startsWith("http") ? "_blank" : undefined}
                                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        ))}
    </footer>
);
