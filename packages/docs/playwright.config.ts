import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    timeout: 30_000,
    expect: { timeout: 5_000 },
    use: {
        baseURL: "http://localhost:10000",
        trace: "on-first-retry",
    },
    webServer: {
        command: "rm -rf .next && NEXT_TELEMETRY_DISABLED=1 pnpm dev",
        url: "http://localhost:10000/docs/date-picker",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
