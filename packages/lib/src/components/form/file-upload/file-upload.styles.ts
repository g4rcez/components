import { defineComponentStyles } from "../../../lib/component-styles";

export const fileUploadStyles = defineComponentStyles({
    name: "file-upload",
    variants: {},
    defaults: {},
    slots: ["file-icon", "remove-icon", "idle-icon"],
    dependencies: ["modal"],
});
