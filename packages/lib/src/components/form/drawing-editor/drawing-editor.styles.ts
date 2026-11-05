import { defineComponentStyles } from "../../../lib/component-styles";
export const drawingEditorStyles = defineComponentStyles({
    name: "drawing-editor",
    variants: {},
    defaults: {},
    slots: ["toolbar", "workspace", "viewport", "stage", "canvas-frame", "overlay", "selection", "layers", "layer-list", "properties"],
    dependencies: ["button", "input", "textarea", "select", "checkbox", "alert", "resizable"],
});
