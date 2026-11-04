import { defineComponentStyles } from "../../../lib/component-styles";

export const richTextEditorStyles = defineComponentStyles({
    name: "rich-text-editor",
    variants: {},
    defaults: {},
    css: "@g4rcez/components/rich-text-editor.css",
    slots: ["label", "modes", "toolbar", "content", "source", "fields", "help", "image", "image-content"],
    dependencies: ["button", "input", "textarea", "select", "alert", "resizable"],
});
