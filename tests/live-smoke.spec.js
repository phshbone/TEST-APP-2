const { test, expect } = require('@playwright/test');

function installDiagnostics(page, bucket) {
  page.on('pageerror', error => {
    const text = String(error);
    if (!/Failed to register a ServiceWorker[\s\S]*service-worker\.js[\s\S]*404/i.test(text)) {
      bucket.pageErrors.push(text);
    }
  });
  page.on('console', msg => {
    if (msg.type() === 'error') bucket.consoleErrors.push(msg.text());
  });
  page.on('requestfailed', request => {
    const url = request.url();
    if (!/favicon|analytics|google-analytics|service-worker\.js/i.test(url)) {
      bucket.failedRequests.push(`${request.method()} ${url} :: ${request.failure()?.errorText || 'failed'}`);
    }
  });
}

async function openApp(page, diagnostics) {
  installDiagnostics(page, diagnostics);
  const target = process.env.LIVE_SMOKE_URL;
  expect(target, 'LIVE_SMOKE_URL must be configured').toBeTruthy();
  const response = await page.goto(target, { waitUntil: 'domcontentloaded' });
  expect(response, 'deployment should return a response').not.toBeNull();
  expect(response.status(), 'deployment should load successfully').toBeLessThan(400);

  const gateway = page.getByRole('button', { name: /open the page/i });
  if (await gateway.count()) {
    await gateway.first().click();
    await page.waitForLoadState('domcontentloaded');
  }

  await expect(page.locator('#mainContent')).toBeVisible();
  await expect(page.locator('.bottom-nav')).toBeVisible();
}

async function assertNoFatalDiagnostics(diagnostics) {
  expect(diagnostics.pageErrors, `uncaught page errors: ${diagnostics.pageErrors.join('\n')}`).toEqual([]);
  expect(diagnostics.failedRequests, `critical failed requests: ${diagnostics.failedRequests.join('\n')}`).toEqual([]);
}

test.describe('deployed Poll Worker Training live smoke', () => {
  test('Early Voting Guide accordion, anchoring, warning, checks and statuses remain stable', async ({ page }, testInfo) => {
    const diagnostics = { pageErrors: [], consoleErrors: [], failedRequests: [] };
    await openApp(page, diagnostics);

    await page.locator('.bottom-nav [data-route="guide"]').click();
    await expect(page.locator('#sectionTitle')).toHaveText('Trainer Checklist');

    const main = page.locator('#mainContent');
    const shutdown = page.locator('[data-procedure="shutdown"]');
    await expect(shutdown).toBeVisible();

    if (!(await shutdown.evaluate(el => el.classList.contains('expanded')))) {
      await shutdown.locator('.procedure-toggle').click();
    }
    await expect(shutdown).toHaveClass(/expanded/);
    await expect(page.locator('.procedure-card.expanded'), 'only one standard Guide card should remain expanded').toHaveCount(1);

    const mainTop = await main.evaluate(el => el.getBoundingClientRect().top);
    const shutdownTop = await shutdown.evaluate(el => el.getBoundingClientRect().top);
    expect(Math.abs(shutdownTop - mainTop), 'opened Guide card should be anchored near the top').toBeLessThanOrEqual(28);

    const warning = shutdown.locator('.warning-box');
    await expect(warning).toBeVisible();
    const warningText = (await warning.innerText()).replace(/\s+/g, ' ').trim();
    expect(warningText.match(/DO NOT SELECT CLOSE POLL/gi) || [], 'shutdown warning heading must not be duplicated').toHaveLength(1);

    const statusButtons = shutdown.locator('[data-guide-section-status="shutdown"]');
    await expect(statusButtons).toHaveCount(4);
    const beforeStatusScroll = await main.evaluate(el => el.scrollTop);
    await statusButtons.nth(0).click();
    await statusButtons.nth(1).click();
    await expect(statusButtons.nth(0)).toHaveAttribute('aria-pressed', 'true');
    await expect(statusButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await statusButtons.nth(0).click();
    await expect(statusButtons.nth(0)).toHaveAttribute('aria-pressed', 'false');
    await expect(statusButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    const afterStatusScroll = await main.evaluate(el => el.scrollTop);
    expect(Math.abs(afterStatusScroll - beforeStatusScroll), 'Training Status clicks should not jump').toBeLessThanOrEqual(4);

    const firstCheck = shutdown.locator('input[data-check="shutdown"]').first();
    await expect(firstCheck).toBeVisible();
    const beforeCheckScroll = await main.evaluate(el => el.scrollTop);
    const beforeBox = await shutdown.boundingBox();
    await firstCheck.check();
    const afterBox = await shutdown.boundingBox();
    const afterCheckScroll = await main.evaluate(el => el.scrollTop);
    expect(Math.abs(afterCheckScroll - beforeCheckScroll), 'checklist checks should not move the scroll pane').toBeLessThanOrEqual(4);
    if (beforeBox && afterBox) expect(Math.abs(afterBox.y - beforeBox.y), 'checklist checks should not shift the card').toBeLessThanOrEqual(4);

    const checkin = page.locator('[data-procedure="checkin"]');
    const lessons = checkin.locator('[data-open-lesson]');
    if (await lessons.count() >= 2) {
      await lessons.nth(0).click();
      await lessons.nth(1).click();
      const secondKey = await lessons.nth(1).getAttribute('data-open-lesson');
      await expect(checkin.locator(`[data-lesson-card="${secondKey}"]`)).toHaveClass(/active/);
      const activeLessons = checkin.locator('.lesson-card.active');
      await expect(activeLessons, 'only one teaching lesson should be open').toHaveCount(1);
      const activeTop = await activeLessons.first().evaluate(el => el.getBoundingClientRect().top);
      const paneTop = await main.evaluate(el => el.getBoundingClientRect().top);
      expect(Math.abs(activeTop - paneTop), 'opened teaching lesson should be anchored near the top').toBeLessThanOrEqual(28);
    }

    await page.screenshot({ path: testInfo.outputPath('early-voting-guide.png'), fullPage: true });
    await assertNoFatalDiagnostics(diagnostics);
  });

  test('Election Day Training Status controls toggle independently without jumping', async ({ page }, testInfo) => {
    const diagnostics = { pageErrors: [], consoleErrors: [], failedRequests: [] };
    await openApp(page, diagnostics);

    await page.locator('.mode-button[data-mode="election"]').click();
    await page.locator('.bottom-nav [data-route="guide"]').click();

    const opening = page.locator('[data-procedure="opening"]');
    await expect(opening).toBeVisible();
    const main = page.locator('#mainContent');

    const firstLessonToggle = opening.locator('[data-open-lesson]').first();
    if (await firstLessonToggle.count()) {
      const key = await firstLessonToggle.getAttribute('data-open-lesson');
      const card = opening.locator(`[data-lesson-card="${key}"]`);
      if (!(await card.evaluate(el => el.classList.contains('active')))) await firstLessonToggle.click();
    }

    const target = opening.locator('[data-lesson-status]:visible').first();
    await expect(target, 'Election Day opening should expose a visible Training Status control').toBeVisible();
    const group = target.locator('xpath=ancestor::*[contains(@class,"lesson-status")][1]');
    const buttons = group.locator('[data-status]');
    await expect(buttons).toHaveCount(4);

    const scrollBefore = await main.evaluate(el => el.scrollTop);
    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true');
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'false');
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'false');
    const scrollAfter = await main.evaluate(el => el.scrollTop);
    expect(Math.abs(scrollAfter - scrollBefore), 'Election Day status toggles should not jump').toBeLessThanOrEqual(4);

    await page.screenshot({ path: testInfo.outputPath('election-day-status.png'), fullPage: true });
    await assertNoFatalDiagnostics(diagnostics);
  });

  test('Daily Report wording and MPW icon are present in deployed build', async ({ page }, testInfo) => {
    const diagnostics = { pageErrors: [], consoleErrors: [], failedRequests: [] };
    await openApp(page, diagnostics);

    expect(await page.locator('.brand-logo').getAttribute('src'), 'header logo should use the embedded MPW icon').toMatch(/^data:image\/png;base64,/);
    expect(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'), 'Apple touch icon should use the embedded MPW icon').toMatch(/^data:image\/png;base64,/);

    await page.locator('.bottom-nav [data-route="report"]').click();
    const reportText = (await page.locator('#mainContent').innerText()).replace(/\s+/g, ' ');
    expect(reportText).toMatch(/Report date:\s+.+?\s+•\s+Mode:\s+(Early Voting|Election Day)/i);

    await page.screenshot({ path: testInfo.outputPath('daily-report.png'), fullPage: true });
    await assertNoFatalDiagnostics(diagnostics);
  });
});
