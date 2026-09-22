"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@g4rcez/components";
import { ArrowRightIcon, QuestionIcon } from "@phosphor-icons/react";

const quickLinks = [
    { title: "Get started", description: "Installation and your first component", href: "/docs/get-started" },
    { title: "Components", description: "Browse components and examples", href: "/docs" },
    { title: "Theming", description: "Colors, tokens, and customization", href: "/docs/setup" },
    { title: "GitHub", description: "Source code, issues, and contributions", href: "https://github.com/g4rcez/components" },
];

export const FloatingAction = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" className="site-help-button" aria-label="Open quick links" aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
                <QuestionIcon size={20} aria-hidden="true" />
                <span>Quick links</span>
            </button>
            <Modal open={isOpen} onChange={setIsOpen} title="Quick links" type="dialog" overlayClickClose>
                <nav aria-label="Quick links" className="site-quick-links">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                            onClick={() => setIsOpen(false)}
                        >
                            <span>
                                <strong>{link.title}</strong>
                                <span>{link.description}</span>
                            </span>
                            <ArrowRightIcon size={17} aria-hidden="true" />
                        </Link>
                    ))}
                </nav>
            </Modal>
        </>
    );
};
