"use client";
import { DocsLayout } from "@/components/docs-layout";
import { useState } from "react";
import { Alert, Button, Card } from "../../../../../lib/src";

export default function AlertPage() {
  const [state, setState] = useState(true);
  return (
    <DocsLayout title="Alert" section="display" description="">
      <Card title="All alerts">
        <Button className="mb-4" onClick={() => setState((p) => !p)}>
          Toggle
        </Button>
        <div className="space-y-4">
          <Alert open={state} title="Primary" theme="primary">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
          <Alert open={state} title="Secondary" theme="secondary">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
          <Alert open={state} title="Danger" theme="danger">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
          <Alert open={state} title="Info" theme="info">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
          <Alert open={state} title="Neutral" theme="neutral">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
          <Alert open={state} title="Success" theme="success">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
          <Alert open={state} title="Warn" theme="warn">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
          <Alert open={state} title="Without theme">
            <p>Magna pars studiorum, prodita quaerimus.</p>
          </Alert>
        </div>
      </Card>
    </DocsLayout>
  );
}
