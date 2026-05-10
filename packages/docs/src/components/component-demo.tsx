import { PropsWithChildren } from "react";
import { CodeBlock } from "./code-block";
import { LinkIcon } from "@phosphor-icons/react";

type ComponentDemoProps = {
    title: string;
    description: string;
    code: string;
    className?: string;
    demoClassName?: string;
};

export const ComponentDemo = ({ title, description, code, children, className = "", demoClassName = "" }: PropsWithChildren<ComponentDemoProps>) => {
    const id = title.toLowerCase().replace(/\s+/g, "-");
    return (
        <section id={id} className={`scroll-mt-24 space-y-6 overflow-clip ${className}`}>
            <div className="space-y-2">
                <h3 className="group flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                    <a href={`#${id}`} className="no-underline hover:underline">
                        {title}
                    </a>
                    <LinkIcon className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="max-w-3xl text-[15px] font-medium leading-relaxed text-muted-foreground">{description}</p>
            </div>
            <div className="overflow-clip rounded-xl border border-card-border">
                <div
                    className={`flex min-h-full flex-col items-center justify-center bg-gradient-to-br from-background via-primary-hover/5 to-card-background p-8 ${demoClassName}`}
                >
                    <div className="z-10 flex w-full flex-1 flex-col items-center justify-center">{children}</div>
                </div>
                <div className="border-t border-card-border p-4">
                    <CodeBlock code={code} />
                </div>
            </div>
        </section>
    );
};
