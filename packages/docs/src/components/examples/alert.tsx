import { Card } from "@g4rcez/components/card";
import { Alert } from "@g4rcez/components/alert";
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
