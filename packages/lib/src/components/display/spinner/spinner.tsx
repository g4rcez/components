import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import { spinnerStyles } from "./spinner.styles";

export const Spinner = (props: { className?: string }) => {
    const t = useTranslations();
    return (
        <span
            role="status"
            aria-live="polite"
            aria-label={t.spinnerLoading}
            data-component="spinner"
            className={css(spinnerStyles.className({}), props.className)}
        />
    );
};

export const Loading = () => {
    return (
        <div data-component="spinner" data-slot="container" className={spinnerStyles.slots.container}>
            <Spinner />
        </div>
    );
};
