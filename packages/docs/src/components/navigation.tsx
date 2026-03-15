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
            <h5 className="mb-3 text-[13px] font-medium text-foreground/40 tracking-wide px-4 lg:px-0">
              {section.title}
            </h5>

            <ul className="space-y-1 border-l border-border/40 ml-0.5">
              {section.items.map((item) => {
                const isActive = path === item.href;

                return (
                  <li key={`section-item-${item.title}`}>
                    <Link
                      href={item.href}
                      className={`
                        block pl-4 py-1.5 text-[14px] transition-all border-l -ml-px
                        ${
                          isActive
                            ? "text-primary border-primary font-semibold"
                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                        }
                      `}
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
