import { defineComponentStyles } from "../../../lib/component-styles";
export const pdfViewerStyles = defineComponentStyles({
    name: "pdf-viewer",
    variants: {},
    defaults: {},
    slots: ["toolbar", "page"],
    dependencies: ["button", "select", "alert"],
});
