"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections } from "../config/navigation";

export const Navigation = () => {
    const path = usePathname();

    return (
        <nav className="space-y-8 pr-6">
            {sections.map((section) => {
                return (
                    <div key={`section-${section.title}`}>
                        <h5 className="mb-3 px-4 text-[13px] font-medium tracking-wide text-foreground/40 lg:px-0">{section.title}</h5>

                        <ul className="ml-0.5 space-y-1 border-l border-border/40">
                            {section.items.map((item) => {
                                const isActive = path === item.href;

                                return (
                                    <li key={`section-item-${item.title}`}>
                                        <Link
                                            href={item.href}
                                            className={`-ml-px block border-l py-1.5 pl-4 text-[14px] transition-all ${
                                                isActive
                                                    ? "border-primary font-semibold text-primary"
                                                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                                            } `}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </nav>
    );
};
