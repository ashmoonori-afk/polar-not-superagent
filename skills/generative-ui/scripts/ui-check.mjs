#!/usr/bin/env bun
/**
 * generative-ui browser checker (scripts/ui-check.mjs)
 *
 * Launches the installed Google Chrome via playwright-core (channel: 'chrome'),
 * renders a target URL or local HTML file at 390x844 (mobile) and 1280x800 (desktop),
 * captures full-page screenshots, and prints a structured JSON report of UI findings.
 *
 * Usage:
 *   bun scripts/ui-check.mjs <url-or-html-path> [--out <dir>] [--wait <ms>] [--json-out <file>]
 *
 * Exit codes:
 *   0 - Check completed (findings printed as JSON to stdout)
 *   1 - Checker execution failure (missing target, browser launch failure, etc.)
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

async function loadPlaywrightCore() {
  // 1. Direct import (if installed in project or NODE_PATH)
  try {
    return await import("playwright-core");
  } catch {}

  // 2. Local skill node_modules or parent workspace node_modules
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const localCandidates = [
    path.resolve(scriptDir, "../node_modules/playwright-core/index.mjs"),
    path.resolve(scriptDir, "../node_modules/playwright-core/index.js"),
    path.resolve(process.cwd(), "node_modules/playwright-core/index.mjs"),
    path.resolve(process.cwd(), "node_modules/playwright-core/index.js"),
  ];

  // 3. Bun global install cache (~/.bun/install/cache/playwright-core*)
  const bunCacheDir = path.join(os.homedir(), ".bun", "install", "cache");
  if (fs.existsSync(bunCacheDir)) {
    try {
      const entries = fs
        .readdirSync(bunCacheDir)
        .filter((e) => e.startsWith("playwright-core@"))
        .sort()
        .reverse();
      for (const entry of entries) {
        localCandidates.push(path.join(bunCacheDir, entry, "index.mjs"));
        localCandidates.push(path.join(bunCacheDir, entry, "index.js"));
      }
    } catch {}
  }

  // 4. Temp on-demand cache directory
  const tmpCacheDir = path.join(os.tmpdir(), "generative-ui-pw-cache");
  localCandidates.push(
    path.join(tmpCacheDir, "node_modules", "playwright-core", "index.mjs"),
    path.join(tmpCacheDir, "node_modules", "playwright-core", "index.js")
  );

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      try {
        return await import(pathToFileURL(candidate).href);
      } catch {}
    }
  }

  // 5. Install playwright-core on demand into temp cache without downloading browsers
  fs.mkdirSync(tmpCacheDir, { recursive: true });
  const env = { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1" };
  const bunRes = spawnSync("bun", ["add", "--no-save", "playwright-core"], {
    cwd: tmpCacheDir,
    env,
    stdio: "ignore",
  });
  if (bunRes.status !== 0) {
    spawnSync("npm", ["install", "--no-save", "playwright-core"], {
      cwd: tmpCacheDir,
      env,
      stdio: "ignore",
    });
  }
  const installedEntry = path.join(
    tmpCacheDir,
    "node_modules",
    "playwright-core",
    "index.js"
  );
  if (fs.existsSync(installedEntry)) {
    return await import(pathToFileURL(installedEntry).href);
  }

  throw new Error(
    "Could not resolve playwright-core. Install it via `bun add playwright-core` or `npm i playwright-core`."
  );
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let target = null;
  let outDir = null;
  let jsonOut = null;
  let waitMs = 1600;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--out" && args[i + 1]) {
      outDir = args[++i];
    } else if (arg === "--json-out" && args[i + 1]) {
      jsonOut = args[++i];
    } else if (arg === "--wait" && args[i + 1]) {
      waitMs = Number(args[++i]) || 1600;
    } else if (!arg.startsWith("--") && !target) {
      target = arg;
    }
  }
  return { target, outDir, jsonOut, waitMs };
}

function resolveTargetUrl(target) {
  if (/^https?:\/\//i.test(target) || /^file:\/\//i.test(target)) {
    return target;
  }
  const abs = path.resolve(process.cwd(), target);
  if (!fs.existsSync(abs)) {
    throw new Error(`Target file does not exist: ${abs}`);
  }
  return pathToFileURL(abs).href;
}

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "desktop", width: 1280, height: 800, isMobile: false },
];

async function runCheck() {
  const { target, outDir, jsonOut, waitMs } = parseArgs(process.argv);
  if (!target) {
    console.error(
      "Usage: bun scripts/ui-check.mjs <url-or-html-path> [--out <dir>] [--wait <ms>] [--json-out <file>]"
    );
    process.exit(1);
  }

  const targetUrl = resolveTargetUrl(target);
  const baseName = path
    .basename(target.replace(/[?#].*$/, ""), path.extname(target))
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const resolvedOutDir = outDir
    ? path.resolve(process.cwd(), outDir)
    : path.resolve(process.cwd(), "ui-check-out");
  fs.mkdirSync(resolvedOutDir, { recursive: true });

  const pw = await loadPlaywrightCore();
  const chromium = pw.chromium || pw.default?.chromium;
  if (!chromium) {
    throw new Error("Failed to load chromium launcher from playwright-core.");
  }

  let browser = null;
  try {
    try {
      browser = await chromium.launch({
        channel: "chrome",
        headless: true,
        args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
      });
    } catch {
      browser = await chromium.launch({
        channel: "msedge",
        headless: true,
      });
    }

    const allFindings = [];
    const screenshots = {};
    const metricsByViewport = {};

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        consoleErrors.push(err.message || String(err));
      });

      // Install CLS observer and streaming layout-stability tracker before navigation
      await page.addInitScript(() => {
        window.__uiCheckCls = 0;
        window.__uiCheckShifts = [];
        try {
          const po = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__uiCheckCls += entry.value;
                window.__uiCheckShifts.push({
                  value: Number(entry.value.toFixed(4)),
                  startTime: Math.round(entry.startTime),
                });
              }
            }
          });
          po.observe({ type: "layout-shift", buffered: true });
        } catch {}
      });

      await page.goto(targetUrl, { waitUntil: "load", timeout: 15000 });
      if (waitMs > 0) {
        await page.waitForTimeout(waitMs);
      }

      const screenshotPath = path.join(
        resolvedOutDir,
        `${baseName}-${vp.name}-${vp.width}x${vp.height}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots[vp.name] = screenshotPath;

      const audit = await page.evaluate((vpInfo) => {
        const findings = [];
        const vw = vpInfo.width;

        function describeEl(el) {
          if (!el?.tagName) return "unknown";
          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : "";
          const cls =
            typeof el.className === "string" && el.className.trim()
              ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
              : "";
          const txt = (el.innerText || el.textContent || "")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 36);
          return `${tag}${id}${cls}${txt ? ` ("${txt}")` : ""}`;
        }

        function isSrOnly(rect, style) {
          if (rect.width <= 1.5 && rect.height <= 1.5) return true;
          if (style.clip === "rect(0px, 0px, 0px, 0px)") return true;
          return false;
        }

        function isVisible(el) {
          const style = window.getComputedStyle(el);
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            Number(style.opacity) === 0
          ) {
            return false;
          }
          const rect = el.getBoundingClientRect();
          if (isSrOnly(rect, style)) return false;
          return rect.width > 0.5 && rect.height > 0.5;
        }

        function parseRgba(str) {
          const m = str.match(
            /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i
          );
          if (!m) return { r: 255, g: 255, b: 255, a: 0 };
          return {
            r: Number(m[1]),
            g: Number(m[2]),
            b: Number(m[3]),
            a: m[4] !== undefined ? Number(m[4]) : 1,
          };
        }

        function blend(fg, bg) {
          const a = fg.a + bg.a * (1 - fg.a);
          if (a === 0) return { r: 255, g: 255, b: 255, a: 0 };
          return {
            r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
            g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
            b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
            a,
          };
        }

        function getEffectiveBg(el) {
          const layers = [];
          let cur = el;
          while (cur && cur.nodeType === 1) {
            const bg = parseRgba(window.getComputedStyle(cur).backgroundColor);
            if (bg.a > 0) layers.push(bg);
            if (bg.a >= 1) break;
            cur = cur.parentElement;
          }
          // Default canvas white
          let acc = { r: 255, g: 255, b: 255, a: 1 };
          for (let i = layers.length - 1; i >= 0; i--) {
            acc = blend(layers[i], acc);
          }
          return acc;
        }

        function luminance({ r, g, b }) {
          const chan = [r, g, b].map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
        }

        function contrastRatio(c1, c2) {
          const l1 = luminance(c1);
          const l2 = luminance(c2);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        function hasDirectText(el) {
          for (const node of el.childNodes) {
            if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
              return true;
            }
          }
          return false;
        }

        // 1. Horizontal overflow check
        const docScrollWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body ? document.body.scrollWidth : 0
        );
        if (docScrollWidth > vw + 1) {
          findings.push({
            id: "horizontal-overflow",
            severity: "must-fix",
            viewport: vpInfo.name,
            element: "document.documentElement",
            message: `Page overflows horizontally: scrollWidth is ${docScrollWidth}px at ${vw}px viewport width.`,
          });
        }

        const allElements = Array.from(document.querySelectorAll("body *"));
        const textBoxes = [];
        let smallFontCount = 0;
        let lowContrastCount = 0;
        let smallTapCount = 0;
        let edgeCrowdCount = 0;
        let clipOverlapCount = 0;

        for (const el of allElements) {
          if (!isVisible(el)) continue;
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          const directText = hasDirectText(el);
          const tag = el.tagName.toLowerCase();

          // 7. Images without alt
          if (tag === "img") {
            const alt = el.getAttribute("alt");
            if (alt === null) {
              findings.push({
                id: "missing-alt",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: describeEl(el),
                message: `Image is missing an alt attribute (${el.getAttribute("src") || "inline"}).`,
              });
            }
          }

          // Text checks: font-size < 12px & WCAG AA contrast & edge crowding
          if (directText) {
            const fontSize = parseFloat(style.fontSize);
            const fontWeight = parseInt(style.fontWeight, 10) || 400;
            if (fontSize < 12 && smallFontCount < 6) {
              smallFontCount++;
              findings.push({
                id: "small-font-size",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: describeEl(el),
                message: `Computed font-size is ${fontSize}px (minimum legible size is 12px).`,
              });
            }

            const fgRaw = parseRgba(style.color);
            const bg = getEffectiveBg(el);
            const fg = blend(fgRaw, bg);
            const ratio = contrastRatio(fg, bg);
            const isLarge =
              fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
            const minRatio = isLarge ? 3.0 : 4.5;
            if (ratio < minRatio - 0.05 && lowContrastCount < 6) {
              lowContrastCount++;
              findings.push({
                id: "low-contrast",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: describeEl(el),
                message: `Text contrast ratio is ${ratio.toFixed(2)}:1 (requires at least ${minRatio}:1 for WCAG AA).`,
              });
            }

            if (
              vpInfo.isMobile &&
              rect.width > 4 &&
              (rect.left < 12 || vw - rect.right < 12) &&
              edgeCrowdCount < 5
            ) {
              edgeCrowdCount++;
              findings.push({
                id: "edge-crowding",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: describeEl(el),
                message: `Content touches or crowds viewport edge on mobile (left=${Math.round(rect.left)}px, rightGap=${Math.round(vw - rect.right)}px; minimum padding is 12px).`,
              });
            }

            textBoxes.push({ el, rect, desc: describeEl(el) });
          }

          const hasAnyText = (el.innerText || "").trim().length > 0;
          if (hasAnyText && clipOverlapCount < 5) {
            const ox = style.overflowX;
            const oy = style.overflowY;
            const hasEllipsis = style.textOverflow === "ellipsis";
            if (
              (ox === "hidden" || ox === "clip") &&
              !hasEllipsis &&
              el.clientWidth > 0 &&
              el.scrollWidth > el.clientWidth + 4
            ) {
              clipOverlapCount++;
              findings.push({
                id: "overlapping-or-clipped-text",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: describeEl(el),
                message: `Text is horizontally clipped (${el.scrollWidth}px content inside ${el.clientWidth}px box without ellipsis).`,
              });
            } else if (
              (oy === "hidden" || oy === "clip") &&
              el.clientHeight > 0 &&
              el.scrollHeight > el.clientHeight + 4
            ) {
              clipOverlapCount++;
              findings.push({
                id: "overlapping-or-clipped-text",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: describeEl(el),
                message: `Text is vertically clipped (${el.scrollHeight}px content inside ${el.clientHeight}px box).`,
              });
            }
          }

          // 4. Tap targets < 44px on mobile
          const isInteractive =
            tag === "button" ||
            tag === "input" ||
            tag === "select" ||
            tag === "textarea" ||
            (tag === "a" && el.hasAttribute("href")) ||
            el.getAttribute("role") === "button" ||
            el.getAttribute("role") === "switch" ||
            el.getAttribute("role") === "tab";

          if (vpInfo.isMobile && isInteractive && smallTapCount < 6) {
            if (rect.width < 44 - 0.5 || rect.height < 44 - 0.5) {
              smallTapCount++;
              findings.push({
                id: "small-tap-target",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: describeEl(el),
                message: `Mobile tap target is ${Math.round(rect.width)}x${Math.round(rect.height)}px (minimum is 44x44px).`,
              });
            }
          }
        }

        // 5b. Overlapping sibling/unrelated text elements check
        for (let i = 0; i < textBoxes.length && clipOverlapCount < 5; i++) {
          for (let j = i + 1; j < textBoxes.length && clipOverlapCount < 5; j++) {
            const a = textBoxes[i];
            const b = textBoxes[j];
            if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
            const xOverlap = Math.max(
              0,
              Math.min(a.rect.right, b.rect.right) -
                Math.max(a.rect.left, b.rect.left)
            );
            const yOverlap = Math.max(
              0,
              Math.min(a.rect.bottom, b.rect.bottom) -
                Math.max(a.rect.top, b.rect.top)
            );
            if (xOverlap > 6 && yOverlap > 6) {
              clipOverlapCount++;
              findings.push({
                id: "overlapping-or-clipped-text",
                severity: "must-fix",
                viewport: vpInfo.name,
                element: `${a.desc} vs ${b.desc}`,
                message: `Text elements overlap by ${Math.round(xOverlap)}x${Math.round(yOverlap)}px.`,
              });
            }
          }
        }

        // 9. Layout shift (CLS > 0.1)
        const cls = Number((window.__uiCheckCls || 0).toFixed(4));
        if (cls > 0.1) {
          findings.push({
            id: "layout-shift",
            severity: "must-fix",
            viewport: vpInfo.name,
            element: "window (PerformanceObserver layout-shift)",
            message: `Cumulative Layout Shift (CLS) during load/streaming is ${cls} (exceeds 0.10 threshold).`,
          });
        }

        // 10. Missing loading/empty/error states heuristic on declared data regions (should-fix)
        const dataRegions = Array.from(
          document.querySelectorAll(
            "[data-region], [data-stream], [data-list], [role='feed']"
          )
        );
        for (const region of dataRegions) {
          const declaredStates = (region.getAttribute("data-states") || "")
            .split(/[,\s]+/)
            .filter(Boolean);
          const hasLoading =
            declaredStates.includes("loading") ||
            Boolean(
              region.querySelector(
                "[data-state='loading'], [data-loading], .skeleton, [aria-busy]"
              )
            );
          const hasEmpty =
            declaredStates.includes("empty") ||
            Boolean(
              region.querySelector(
                "[data-state='empty'], [data-empty], template[data-empty]"
              )
            );
          const hasError =
            declaredStates.includes("error") ||
            Boolean(
              region.querySelector(
                "[data-state='error'], [data-error], template[data-error]"
              )
            );

          if (!hasLoading || !hasEmpty || !hasError) {
            const missing = [
              !hasLoading ? "loading" : null,
              !hasEmpty ? "empty" : null,
              !hasError ? "error" : null,
            ].filter(Boolean);
            findings.push({
              id: "missing-states",
              severity: "should-fix",
              viewport: vpInfo.name,
              element: describeEl(region),
              message: `Data region is missing declared ${missing.join("/")} state handling (provide [data-state] slots, templates, or data-states="loading,empty,error").`,
            });
          }
        }

        return {
          findings,
          metrics: {
            scrollWidth: docScrollWidth,
            viewportWidth: vw,
            cls,
            shiftEvents: (window.__uiCheckShifts || []).length,
            dataRegionsCount: dataRegions.length,
          },
        };
      }, vp);

      // 8. Console errors
      for (const errText of consoleErrors) {
        audit.findings.push({
          id: "console-error",
          severity: "must-fix",
          viewport: vp.name,
          element: "console",
          message: `Console/page error: ${errText}`,
        });
      }

      allFindings.push(...audit.findings);
      metricsByViewport[vp.name] = audit.metrics;
      await context.close();
    }

    const mustFixCount = allFindings.filter(
      (f) => f.severity === "must-fix"
    ).length;
    const shouldFixCount = allFindings.filter(
      (f) => f.severity === "should-fix"
    ).length;

    const report = {
      target,
      targetUrl,
      checkedAt: new Date().toISOString(),
      summary: {
        mustFix: mustFixCount,
        shouldFix: shouldFixCount,
        total: allFindings.length,
        passed: mustFixCount === 0,
      },
      screenshots,
      metrics: metricsByViewport,
      findings: allFindings,
    };

    const jsonString = JSON.stringify(report, null, 2);
    if (jsonOut) {
      const jsonOutPath = path.resolve(process.cwd(), jsonOut);
      fs.mkdirSync(path.dirname(jsonOutPath), { recursive: true });
      fs.writeFileSync(jsonOutPath, `${jsonString}\n`, "utf8");
    }
    console.log(jsonString);
    process.exit(0);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}

runCheck().catch((err) => {
  console.error(
    JSON.stringify(
      {
        error: err.message || String(err),
      },
      null,
      2
    )
  );
  process.exit(1);
});
