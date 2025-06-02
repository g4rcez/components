"use client";
import { DocsLayout } from "@/components/docs-layout";
import { FileUpload, Card } from "../../../../../lib/src";

export default function FileUploadPage() {
  return (
    <DocsLayout title="File upload" section="" description="">
      <Card title="Documents upload">
        <FileUpload />
      </Card>
    </DocsLayout>
  );
}
