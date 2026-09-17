const inputFields = ["INPUT", "SELECT", "TEXTAREA"];

export const formReset = (form?: HTMLFormElement | null) => {
    if (!form) return;
    form.reset();
    Array.from(form.elements).forEach((field) => {
        if (inputFields.includes(field.tagName)) field.setAttribute("data-initialized", "false");
    });
};
