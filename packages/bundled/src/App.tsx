import { Button, Card, Input } from "@g4rcez/components";

export function App() {
    return (
        <main className="shell" aria-labelledby="bundled-title">
            <section className="panel">
                <p className="eyebrow">Vite install fixture</p>
                <h1 id="bundled-title">@g4rcez/components bundled fixture</h1>
                <p className="description">
                    The Vite fixture verifies root imports and foundation CSS with Button, Card, and Input outside a provider or theme configuration.
                </p>
                <Button theme="primary">Runtime smoke button</Button>
                <Card title="Card CSS smoke">Card defaults without a provider.</Card>
                <Input name="email" title="Email" placeholder="you@example.com" />
            </section>
        </main>
    );
}
