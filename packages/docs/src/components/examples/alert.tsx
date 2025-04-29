import { Card } from "../../../../lib/src/components/display/card";
import { Alert } from "../../../../lib/src/components/display/alert";
import Link from "next/link";

export const AlertExample = () => {
  return (
    <Card title={<Link href="/docs/alert">Alert</Link>}>
      <Alert title="Awesome" theme="success">
        You can use this component to show import messages.
      </Alert>
    </Card>
  );
};
