"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { FileUpload, Card } from "../../../../../lib/src";

export default function FileUploadPage() {
  return (
    <DocsLayout title="File Upload" section="form" description="A comprehensive drag-and-drop file upload component.">
      <ComponentDemo
        title="Basic File Upload"
        description="Demonstrates a simple file upload area for documents. Click or drag files to upload."
        code={`"use client";
import { FileUpload } from "@g4rcez/components";

function BasicFileUpload() {
  return (
    <FileUpload />
  );
}`}
      >
        <Card title="Documents upload">
          <FileUpload />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
