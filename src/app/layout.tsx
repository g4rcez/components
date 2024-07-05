import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Dark from "~/styles/dark.json";
import { createStyles, reduceTokens } from "~/styles/design-tokens";
import Light from "~/styles/light.json";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const lightColors = createStyles.default(
        reduceTokens(Light.colors, (value, _, key) => ({
            key: `--${key}`,
            value: `${value}`,
        }))
    );
    const darkColors = createStyles.dark(
        reduceTokens(Dark.colors, (value, _, key) => ({
            key: `--${key}`,
            value: `${value}`,
        }))
    );
    return (
        <html className={`${inter.className} dark`} lang="pt-br">
            <head>
                <title>Bigweld</title>
                <style>{lightColors}</style>
                <style>{darkColors}</style>
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
