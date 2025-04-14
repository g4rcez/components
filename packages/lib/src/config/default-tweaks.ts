export type Tweaks = {
    table: {
        sorters: boolean;
        filters: boolean;
        operations: boolean;
    };
    input: {
        iconFeedback: boolean;
    };
};

export const defaultTweaks: Tweaks = {
    input: { iconFeedback: true },
    table: { operations: true, sorters: true, filters: true },
};
