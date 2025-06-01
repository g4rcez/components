"use client";
import { DocsLayout } from "@/components/docs-layout";
import { FileUpload } from "../../../../../lib/src";

export default function FileUploadPage() {
  return (
    <DocsLayout title="File upload" section="" description="">
      <FileUpload />
    </DocsLayout>
  );
}
