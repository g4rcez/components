import { PropsWithChildren } from "react";
import { CodeBlock } from "./code-block";
import { LinkIcon } from "lucide-react";

type ComponentDemoProps = {
  title: string;
  description: string;
  code: string;
  className?: string;
  demoClassName?: string;
};

export const ComponentDemo = ({
  title,
  description,
  code,
  children,
  className = "",
  demoClassName = "",
}: PropsWithChildren<ComponentDemoProps>) => {
  const id = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <section
      id={id}
      className={`space-y-6 overflow-clip scroll-mt-24 ${className}`}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 group">
          <a href={`#${id}`} className="no-underline hover:underline">
            {title}
          </a>
          <LinkIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-3xl font-medium">
          {description}
        </p>
      </div>
      <div className="rounded-xl border overflow-clip border-card-border">
        <div
          className={`p-8 min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary-hover/5 to-card-background ${demoClassName}`}
        >
          <div className="w-full flex-1 flex flex-col items-center justify-center z-10">
            {children}
          </div>
        </div>
        <div className="border-t p-4 border-card-border">
          <CodeBlock code={code} />
        </div>
      </div>
    </section>
  );
};
