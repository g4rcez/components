import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";

export const Spinner = (props: { className?: string }) => {
    const t = useTranslations();
    return (
        <span role="status" aria-live="polite" aria-label={t.spinnerLoading} data-component="spinner" className={css("__spinner", props.className)} />
    );
};

export const Loading = () => {
    return (
        <div data-component="spinner" data-slot="container" className="__spinner__container">
            <Spinner />
        </div>
    );
};
