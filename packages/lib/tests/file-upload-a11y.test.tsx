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

import { FileUpload } from "../src/components/form/file-upload/file-upload";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const singleIdleCopy = "Arraste seu arquivo para cá ou";
const singleButtonCopy = "clique para escolher um arquivo";
const singleZoneLabel = "Área de upload de arquivo. Arraste seu arquivo para cá ou pressione Enter para escolher um arquivo.";
const multipleIdleCopy = "Arraste seus arquivos para cá ou";
const multipleButtonCopy = "clique para escolher seus arquivos";
const multipleZoneLabel = "Área de upload de arquivos. Arraste seus arquivos para cá ou pressione Enter para escolher seus arquivos.";

describe("FileUpload a11y", () => {
    it("uses singular copy and accessible labels by default", () => {
        render(
            <ComponentsProvider>
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        expect(screen.getByText(singleIdleCopy)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: singleButtonCopy })).toBeInTheDocument();
        expect(screen.getByLabelText(singleZoneLabel, { selector: "input" })).toBeInTheDocument();
    });

    it("uses singular copy and accessible labels when multiple is false", () => {
        render(
            <ComponentsProvider>
                <FileUpload name="docs" multiple={false} />
            </ComponentsProvider>
        );

        expect(screen.getByText(singleIdleCopy)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: singleButtonCopy })).toBeInTheDocument();
        expect(screen.getByLabelText(singleZoneLabel, { selector: "input" })).toBeInTheDocument();
    });

    it("uses plural copy and accessible labels when multiple is true", () => {
        render(
            <ComponentsProvider>
                <FileUpload name="docs" multiple />
            </ComponentsProvider>
        );

        expect(screen.getByText(multipleIdleCopy)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: multipleButtonCopy })).toBeInTheDocument();
        expect(screen.getByLabelText(multipleZoneLabel, { selector: "input" })).toBeInTheDocument();
    });

    it("preserves custom idle content", () => {
        const CustomIdle = () => <p>Estado personalizado</p>;

        render(
            <ComponentsProvider>
                <FileUpload name="docs" idle={<CustomIdle />} />
            </ComponentsProvider>
        );

        expect(screen.getByText("Estado personalizado")).toBeInTheDocument();
        expect(screen.queryByText(singleIdleCopy)).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: singleButtonCopy })).not.toBeInTheDocument();
        expect(screen.getByLabelText(singleZoneLabel, { selector: "input" })).toBeInTheDocument();
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

    it("clicking the idle action triggers file input click once", async () => {
        const user = userEvent.setup();
        openSpy.mockClear();

        render(
            <ComponentsProvider>
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("button", { name: singleButtonCopy }));

        expect(openSpy).toHaveBeenCalledTimes(1);
    });

    it("keyboard Enter/Space on the idle action trigger file input click", async () => {
        const user = userEvent.setup();
        openSpy.mockClear();

        render(
            <ComponentsProvider>
                <FileUpload name="docs" />
            </ComponentsProvider>
        );

        const uploadButton = screen.getByRole("button", { name: singleButtonCopy });

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
