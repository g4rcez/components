import { createTheme } from "@g4rcez/components/styles/design-tokens";
import {
  defaultDarkTheme,
  defaultLightTheme,
} from "@g4rcez/components/styles/theme";
import { PropsWithChildren } from "react";

export const RootLayout = (props: PropsWithChildren) => {
  const stylesLight = createTheme(defaultLightTheme);
  const stylesDark = createTheme(defaultDarkTheme, "dark");
  return (
    <html className="bg-background text-foreground dark">
      <head>
        <title>Components</title>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body>{props.children}</body>
    </html>
  );
};
