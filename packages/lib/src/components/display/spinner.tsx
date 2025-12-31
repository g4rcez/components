import { css } from "../../lib/dom";

export const Spinner = (props: { className?: string }) => (
    <span
        aria-busy="true"
        aria-description="Carregando..."
        className={css(
            "box-border inline-block aspect-square size-12 animate-spin rounded-full border-4 border-background border-b-primary",
            props.className
        )}
    />
);

export const Loading = () => {
    return (
        <div className="flex h-full w-full items-center justify-center p-12">
            <Spinner />
        </div>
    );
};
