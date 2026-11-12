/** Four tiles in a 16-unit box: three follow the text colour, the top-right one carries the accent (and the larger radius). */
export const LogoMark = ({ className = "docs-brand-mark" }: { className?: string }) => (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="3" className="docs-brand-mark-accent" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
);

export const Wordmark = ({ label = "components" }: { label?: string }) => (
    <>
        <LogoMark />
        <span className="docs-brand-name">{label}</span>
    </>
);
