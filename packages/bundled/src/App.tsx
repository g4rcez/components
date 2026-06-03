import {
    Button,
    ComponentsProvider,
    createTokenStyles,
    defaultDarkTheme,
    defaultLightTheme,
    type TokenRemap,
} from "@g4rcez/components";

const tokenRemap: TokenRemap = {
    colors: (token) => ({
        ...token,
        value: token.value.replace("hsla(", "").replace(/\)$/, ""),
    }),
};

const lightStyles = createTokenStyles(defaultLightTheme, tokenRemap);
const darkStyles = createTokenStyles(defaultDarkTheme, { ...tokenRemap, name: "dark" });

export function App() {
    return (
        <ComponentsProvider locale="en-US">
            <style>{lightStyles}</style>
            <style>{darkStyles}</style>
            <main className="shell" aria-labelledby="bundled-title">
                <section className="panel">
                    <p className="eyebrow">Vite install fixture</p>
                    <h1 id="bundled-title">@g4rcez/components bundled fixture</h1>
                    <p className="description">
                        This page verifies the package root exports, theme helpers, stylesheet export, provider, and Button render in a Vite consumer.
                    </p>
                    <Button theme="primary">Runtime smoke button</Button>
                </section>
            </main>
        </ComponentsProvider>
    );
}
