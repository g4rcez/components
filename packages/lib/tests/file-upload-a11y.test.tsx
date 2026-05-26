import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";

const openSpy = vi.hoisted(() => vi.fn());

vi.mock("react-dropzone", () => ({
    useDropzone: () => ({
        getRootProps: () => ({ role: "presentation", tabIndex: 0 }),
        getInputProps: () => ({ type: "file", multiple: true }),
        isDragActive: false,
        open: openSpy,
    }),
}));

import { FileUpload } from "../src/components/form/file-upload";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

describe("FileUpload a11y", () => {
    it("finds an Upload button by role and name", () => {
        render(
            <ComponentsProvider>
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
    });

    it("uses provider map labels for the idle upload action", () => {
        render(
            <ComponentsProvider
                map={{
                    fileUploadUploadButtonLabel: (label) => `Browse ${label}`,
                    uploadIdleButton: "local files",
                }}
            >
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        expect(screen.getByRole("button", { name: "Browse local files" })).toBeInTheDocument();
    });

    it("uses provider map labels for file view and remove actions", () => {
        const file = new File(["contents"], "report.txt", { type: "text/plain" });

        render(
            <ComponentsProvider
                map={{
                    fileUploadRemoveFile: (name) => `Discard ${name}`,
                    fileUploadViewFile: (name) => `Preview ${name}`,
                }}
            >
                <FileUpload name="docs" files={[file]} />
            </ComponentsProvider>
        );

        expect(screen.getByRole("button", { name: "Preview report.txt" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Discard report.txt" })).toBeInTheDocument();
    });

    it("clicking Upload triggers file input click once", async () => {
        const user = userEvent.setup();
        openSpy.mockClear();

        render(
            <ComponentsProvider>
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("button", { name: /upload/i }));

        expect(openSpy).toHaveBeenCalledTimes(1);
    });

    it("keyboard Enter/Space on Upload trigger file input click", async () => {
        const user = userEvent.setup();
        openSpy.mockClear();

        render(
            <ComponentsProvider>
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        const uploadButton = screen.getByRole("button", { name: /upload/i });

        uploadButton.focus();
        await user.keyboard("{Enter}");
        expect(openSpy).toHaveBeenCalledTimes(1);

        uploadButton.focus();
        await user.keyboard(" ");
        expect(openSpy).toHaveBeenCalledTimes(2);
    });

    it("has no axe violations in idle state", async () => {
        const { container } = render(
            <ComponentsProvider>
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        const results = await axe(container);
        expect(results.violations).toHaveLength(0);
    });
});
