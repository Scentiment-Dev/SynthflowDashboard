/**
 * Cycle 008 — Agent C screenshot capture script (v2 — stable ordering).
 *
 * Boots against an existing preview server (started by the caller), then
 * captures the eight Cycle 008 acceptance screenshots in fresh, isolated
 * page contexts so Playwright cannot leak state between captures.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');
const OUT_DIR = join(
  REPO_ROOT,
  'project-management',
  'reports',
  'cycle-008',
  'screenshots',
);

const BASE = process.env.PREVIEW_URL || 'http://localhost:5188';
const VIEWPORT = { width: 1440, height: 900 };

async function snap(page, name, { fullPage = false } = {}) {
  const file = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage });
  console.log(`  ✓ ${name}.png${fullPage ? ' (full)' : ''}`);
}

async function fresh(browser) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  return { context, page };
}

async function gotoCommandCenter(page) {
  await page.goto(`${BASE}/subscriptions`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="subscription-page-action-bar"]');
}

async function gotoBusinessValue(page) {
  await page.goto(`${BASE}/subscriptions/business-value`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="subscription-page-action-bar"]');
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  // 1 · Filter drawer open (Command Center, fresh page)
  {
    const { context, page } = await fresh(browser);
    await gotoCommandCenter(page);
    await page.click('[data-testid="page-action-filter-button"]');
    await page.waitForSelector('[data-testid="subscription-filter-drawer"]');
    await page.waitForTimeout(250);
    await snap(page, '12-filter-drawer-open');
    await context.close();
  }

  // 2 · Active filter chips applied + 3 · Disabled filter visible
  {
    const { context, page } = await fresh(browser);
    await gotoCommandCenter(page);
    await page.click('[data-testid="page-action-filter-button"]');
    await page.waitForSelector('[data-testid="subscription-filter-drawer"]');
    await page.click('[data-testid="subscription-filter-trust_label-value-high"]');
    await page.click('[data-testid="subscription-filter-trust_label-value-medium"]');
    await page
      .click('[data-testid="subscription-filter-cancellation_reason-value-cost_too_high"]')
      .catch(() => undefined);
    await page.waitForSelector('[data-testid="subscription-filter-drawer-active-chips"]');
    await page.waitForTimeout(200);
    await snap(page, '13-filter-drawer-active-chips');
    // Scroll the Repeat-contact disabled dimension into view for #14.
    await page
      .locator('[data-testid="subscription-filter-repeat_contact"]')
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await snap(page, '14-filter-disabled-reason');
    await context.close();
  }

  // 4 · Export drawer open (Command Center)
  {
    const { context, page } = await fresh(browser);
    await gotoCommandCenter(page);
    await page.click('[data-testid="page-action-export-button"]');
    await page.waitForSelector('[data-testid="subscription-export-drawer"]');
    await page.waitForTimeout(250);
    await snap(page, '16-export-drawer-open');
    // 5 · Manifest preview — scroll down inside drawer
    await page
      .locator('[data-testid="export-manifest-preview"]')
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await snap(page, '17-export-manifest-preview');
    // 6 · Blocked-state callout for selected_rows scope
    await page
      .locator('[data-testid="export-scope-selected_rows-reason"]')
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await snap(page, '18-export-blocked-no-rows-selected');
    await context.close();
  }

  // 7 · Plain-language hard-fail banner on Business Value (missing scenario)
  {
    const { context, page } = await fresh(browser);
    await gotoBusinessValue(page);
    await page.click('[data-testid="business-value-scenario-missing_stayai_final_state"]');
    await page.waitForTimeout(250);
    // Scroll up so the page-header banner is visible.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await snap(page, '19-business-value-missing-banner');
    // Open the export drawer in this scenario — every scope blocked.
    await page.click('[data-testid="page-action-export-button"]');
    await page.waitForSelector('[data-testid="subscription-export-drawer"]');
    await page.waitForTimeout(250);
    await snap(page, '20-export-drawer-blocked-missing-metadata');
    await context.close();
  }

  // 8 · Metric help disclosure — Level 2 + Level 3 expansion
  {
    const { context, page } = await fresh(browser);
    await gotoBusinessValue(page);
    await page.waitForTimeout(150);
    const disclosure = page.locator('button:has-text("Show metric definition")').first();
    await disclosure.scrollIntoViewIfNeeded();
    await disclosure.click();
    await page.waitForTimeout(250);
    await snap(page, '21-metric-help-disclosure');
    // Level 3 governance drawer
    const governance = page.locator('button:has-text("Open governance drawer")').first();
    await governance.scrollIntoViewIfNeeded();
    await governance.click();
    await page.waitForTimeout(250);
    await snap(page, '22-metric-help-governance');
    await context.close();
  }

  // 9 · Reference full-page Command Center shot (toolbar wired)
  {
    const { context, page } = await fresh(browser);
    await gotoCommandCenter(page);
    await page.waitForTimeout(250);
    await snap(page, '15-active-chips-on-action-bar');
    await snap(page, '23-command-center-with-toolbar-full', { fullPage: true });
    await context.close();
  }

  await browser.close();
  console.log(`Saved screenshots to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
