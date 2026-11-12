// Renders the raster brand assets (apple icon, Open Graph and Twitter images) with the real Geist font.
//   node scripts/capture-brand.mjs
// Output is committed, so builds never need a browser. Re-run it after changing the wordmark, tagline or palette.
import { readdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fonts = join(root, "node_modules/geist/dist/fonts");
const face = (family, dir, file, weight) => {
    const data = readFileSync(join(fonts, dir, file)).toString("base64");
    return `@font-face{font-family:"${family}";font-weight:${weight};src:url(data:font/woff2;base64,${data}) format("woff2")}`;
};
const sans = readdirSync(join(fonts, "geist-sans")).filter((name) => name.endsWith(".woff2"));
const pick = (weight) => sans.find((name) => name.toLowerCase().includes(weight));
const css =
    face("GeistBrand", "geist-sans", pick("semibold"), 600) +
    face("GeistBrand", "geist-sans", pick("regular"), 400) +
    face("GeistBrandMono", "geist-mono", "GeistMono-Regular.woff2", 400);

const ink = "hsl(240 6% 94%)";
const bg = "hsl(240 6% 7%)";
const muted = "hsl(240 5% 70%)";
const border = "hsl(240 5% 21%)";
const accent = "hsl(232 85% 70%)";

const mark = (size, fill = ink) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="${fill}"/><rect x="9" y="1" width="6" height="6" rx="3" fill="${accent}"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="${fill}"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="${fill}"/></svg>`;

const apple = `<html><style>${css}html,body{margin:0}body{width:180px;height:180px;display:grid;place-items:center;background:${bg}}</style><body>${mark(112)}</body></html>`;

const chip = (text, wide) =>
    `<div style="padding:14px 22px;border:1px solid ${border};border-radius:14px;background:hsl(240 6% 9%);font:400 24px GeistBrand;color:${muted};${wide ? "min-width:200px;" : ""}">${text}</div>`;
const og = `<html><style>${css}html,body{margin:0}body{width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;background:${bg};color:${ink};font-family:GeistBrand;display:flex;flex-direction:column;justify-content:space-between}</style><body>
<div style="display:flex;align-items:center;gap:20px">${mark(52)}<span style="font:600 40px GeistBrand;letter-spacing:-0.02em">components</span></div>
<div><div style="font:600 72px/1.04 GeistBrand;letter-spacing:-0.04em;max-width:1040px">React components with the details already done.</div>
<div style="margin-top:24px;font:400 28px/1.4 GeistBrand;color:${muted};max-width:860px">Accessible, themeable and motion-aware. Documented with live examples and a generated API reference.</div></div>
<div style="display:flex;gap:16px;align-items:center">${chip("MorphSelect")}${chip("Reactions")}${chip("CardStack")}${chip("Slider")}<span style="margin-left:auto;font:400 24px GeistBrandMono;color:${accent}">@g4rcez/components</span></div></body></html>`;

const browser = await chromium.launch();
const shot = async (html, width, height, path) => {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path });
    await page.close();
};
await shot(apple, 180, 180, join(root, "src/app/apple-icon.png"));
await shot(og, 1200, 630, join(root, "src/app/opengraph-image.png"));
await browser.close();
copyFileSync(join(root, "src/app/opengraph-image.png"), join(root, "src/app/twitter-image.png"));
writeFileSync(join(root, "src/app/opengraph-image.alt.txt"), "components: React components with the details already done.\n");
writeFileSync(join(root, "src/app/twitter-image.alt.txt"), "components: React components with the details already done.\n");
console.log("brand assets written to src/app");
