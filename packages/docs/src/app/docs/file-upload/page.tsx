"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { FileUpload, Card } from "@g4rcez/components";

export default function FileUploadPage() {
    return (
        <DocsLayout title="File Upload" section="form" description="A comprehensive drag-and-drop file upload component.">
            <ComponentDemo
                title="Single File Upload"
                description="FileUpload uses singular idle and accessible copy when multiple is false or omitted."
                code={`"use client";
import { FileUpload } from "@g4rcez/components";

function SingleFileUpload() {
  return <FileUpload />;
}`}
            >
                <Card title="Document upload">
                    <FileUpload />
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Multiple File Upload"
                description="Set multiple to use plural idle and accessible copy for batch uploads."
                code={`"use client";
import { FileUpload } from "@g4rcez/components";

function MultipleFileUpload() {
  return <FileUpload multiple />;
}`}
            >
                <Card title="Documents upload">
                    <FileUpload multiple />
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
