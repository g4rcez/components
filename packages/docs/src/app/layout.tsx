import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";
import { Shell } from "@/components/shell";
import { themeInit } from "@/lib/theme";
import "./index.css";

/** Absolute base for social image URLs. Set NEXT_PUBLIC_SITE_URL where the docs are deployed; the fallback is the local dev server. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:10000";

// No `title` here on purpose: each page renders its own <title>, which React hoists into <head>.
export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: "components",
    description: "Accessible React components with flexible design tokens, built to be themed down to the token.",
    openGraph: { type: "website", siteName: "components", description: "React components with the details already done." },
    twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
    colorScheme: "light dark",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0f0f11" },
    ],
};

export default function Layout(props: PropsWithChildren) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${GeistSans.variable} ${GeistMono.variable} bg-background text-foreground scroll-smooth proportional-nums antialiased`}
        >
            <head>
                <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInit }} />
            </head>
            <body className="docs-body">
                <Shell>{props.children}</Shell>
            </body>
        </html>
    );
}
