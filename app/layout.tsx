import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../src/index.css";
import React from "react";
import { createStyles, defaultDarkTheme, reduceTokens } from "../src";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const lightColors = createStyles.default(
        reduceTokens(defaultDarkTheme.colors, (value, _, key) => ({
            key: `--${key}`,
            value: `${value}`,
        }))
    );
    return (
        <html className={`${inter.className} w-full h-screen`} lang="pt-br">
            <head>
                <title>Bigweld</title>
                <style>{lightColors}</style>
            </head>
            <body className={`${inter.className} w-full h-screen text-foreground bg-background`}>{children}</body>
        </html>
    );
}