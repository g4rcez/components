"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card } from "../../../../../lib/src";
import { Paragraph, Description, Info, PageTitle, PageHeader } from "../../../../../lib/src/components/core/typography";
import { Button } from "../../../../../lib/src";

export default function TypographyPage() {
    return (
        <DocsLayout
            title="Typography"
            section="primitives"
            description="Semantic text primitives: Paragraph, Description, Info, PageTitle, and PageHeader."
        >
            <ComponentDemo
                title="Paragraph and Description"
                description="Paragraph renders body text. Description renders smaller secondary text."
                code={`import { Paragraph, Description } from "@g4rcez/components";

function TextPrimitives() {
  return (
    <div className="flex flex-col gap-4">
      <Paragraph>
        This is a Paragraph component. It renders with base font size and
        snug line height.
      </Paragraph>
      <Description>
        This is a Description. It uses a smaller font and secondary color,
        ideal for captions and helper text.
      </Description>
    </div>
  );
}`}
            >
                <Card title="Paragraph & Description">
                    <div className="flex flex-col gap-4">
                        <Paragraph>This is a Paragraph component. It renders with base font size and snug line height.</Paragraph>
                        <Description>
                            This is a Description. It uses a smaller font and secondary color, ideal for captions and helper text.
                        </Description>
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Info"
                description="Info pairs a label with a value, optionally rendered in a row or column layout."
                code={`import { Info } from "@g4rcez/components";

function InfoComponent() {
  return (
    <div className="flex flex-col gap-4">
      <Info label="Status">Active</Info>
      <Info label="Plan" row>Professional</Info>
      <Info label="Disabled field" disabled="true">Locked value</Info>
    </div>
  );
}`}
            >
                <Card title="Info">
                    <div className="flex flex-col gap-4">
                        <Info label="Status">Active</Info>
                        <Info label="Plan" row>
                            Professional
                        </Info>
                        <Info label="Disabled field" disabled="true">
                            Locked value
                        </Info>
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="PageTitle and PageHeader"
                description="PageTitle renders a large h2 + description pair. PageHeader adds a flex row with actions slot."
                code={`import { PageTitle, PageHeader } from "@g4rcez/components";
import { Button } from "@g4rcez/components";

function PageHeaders() {
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title="Dashboard">
        Overview of your account activity.
      </PageTitle>
      <PageHeader title="Users" description="Manage your team members.">
        <Button theme="success">Invite user</Button>
      </PageHeader>
    </div>
  );
}`}
            >
                <Card title="PageTitle & PageHeader">
                    <div className="flex flex-col gap-8">
                        <PageTitle title="Dashboard">Overview of your account activity.</PageTitle>
                        <PageHeader title="Users" description="Manage your team members.">
                            <Button theme="success">Invite user</Button>
                        </PageHeader>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
