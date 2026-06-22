import { defineComponentStyles } from "../../../lib/component-styles";

export const modalStyles = defineComponentStyles({
    name: "modal",
    variants: {
        type: ["dialog", "drawer", "sheet"],
        position: ["none", "right", "left"],
    },
    defaults: {
        type: "dialog",
        position: "right",
    },
    css: "@g4rcez/components/modal.css",
    slots: [
        "resizer",
        "sheet-pill",
        "overlay",
        "content",
        "sr-description",
        "header",
        "title",
        "body",
        "footer",
        "close-control",
        "close-button",
        "close-icon",
        "confirm-dialog",
        "confirm-actions",
        "confirm-description",
    ],
    dependencies: ["button"],
});
