const { test, expect } = require('@playwright/test');

function installDiagnostics(page, bucket) {
  page.on('pageerror', error => bucket.pageErrors.push(String(error)));
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

  // RawGitHack may put automated/new browser sessions behind a one-time
  // third-party-content confirmation page. Passing through that gateway is
  // deployment setup, not an app interaction.
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
    await expect(page.locator('#sectionTitle')).toContainText(/Guide/i);

    const main = page.locator('#mainContent');
    const shutdown = page.locator('[data-procedure="shutdown"]');
    await expect(shutdown).toBeVisible();
    await shutdown.locator('.procedure-toggle').click();
    await expect(shutdown).toHaveClass(/expanded/);

    const expandedStandardCards = page.locator('.procedure-card.expanded');
    await expect(expandedStandardCards, 'only the newly opened standard Guide card should remain expanded').toHaveCount(1);

    const mainTop = await main.evaluate(el => el.getBoundingClientRect().top);
    const shutdownTop = await shutdown.evaluate(el => el.getBoundingClientRect().top);
    expect(Math.abs(shutdownTop - mainTop), 'opened Guide card should be anchored near the top of the scroll pane').toBeLessThanOrEqual(28);

    const warning = shutdown.locator('.warning-box');
    await expect(warning).toBeVisible();
    const warningText = (await warning.innerText()).replace(/\s+/g, ' ').trim();
    const closePollMatches = warningText.match(/DO NOT SELECT CLOSE POLL/gi) || [];
    expect(closePollMatches, 'shutdown warning heading must not be duplicated').toHaveLength(1);

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
    expect(Math.abs(afterStatusScroll - beforeStatusScroll), 'Training Status clicks should not jump the Guide').toBeLessThanOrEqual(4);

    const firstCheck = shutdown.locator('input[data-check="shutdown"]').first();
    await expect(firstCheck).toBeVisible();
    const beforeCheckScroll = await main.evaluate(el => el.scrollTop);
    const beforeBox = await shutdown.boundingBox();
    await firstCheck.check();
    const afterBox = await shutdown.boundingBox();
    const afterCheckScroll = await main.evaluate(el => el.scrollTop);
    expect(Math.abs(afterCheckScroll - beforeCheckScroll), 'checklist checks should not move the scroll pane').toBeLessThanOrEqual(4);
    if (beforeBox && afterBox) {
      expect(Math.abs(afterBox.y - beforeBox.y), 'checklist checks should not visibly shift the card').toBeLessThanOrEqual(4);
    }

    const checkin = page.locator('[data-procedure="checkin"]');
    const lessons = checkin.locator('[data-open-lesson]');
    if (await lessons.count() >= 2) {
      await lessons.nth(0).click();
      await lessons.nth(1).click();
      const secondKey = await lessons.nth(1).getAttribute('data-open-lesson');
      await expect(checkin.locator(`[data-lesson-card="${secondKey}"]`)).toHaveClass(/active/);
      const activeLessons = checkin.locator('.lesson-card.active');
      await expect(activeLessons, 'only one teaching lesson should be open at a time').toHaveCount(1);
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

    const lessonStatus = opening.locator('[data-lesson-status]').first();
    const sectionStatus = opening.locator('[data-guide-section-status="opening"]').first();
    const target = (await lessonStatus.count()) ? lessonStatus : sectionStatus;
    await expect(target, 'Election Day opening should expose a Training Status control').toBeVisible();

    const group = target.locator('xpath=ancestor::*[contains(@class,"lesson-status") or contains(@class,"guide-section-training")][1]');
    const buttons = group.locator('[data-status]');
    expect(await buttons.count()).toBeGreaterThanOrEqual(4);

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
    expect(Math.abs(scrollAfter - scrollBefore), 'Election Day status toggles should not jump the page').toBeLessThanOrEqual(4);

    await page.screenshot({ path: testInfo.outputPath('election-day-status.png'), fullPage: true });
    await assertNoFatalDiagnostics(diagnostics);
  });

  test('Daily Report wording and MPW icon are present in deployed build', async ({ page }, testInfo) => {
    const diagnostics = { pageErrors: [], consoleErrors: [], failedRequests: [] };
    await openApp(page, diagnostics);

    const logoSrc = await page.locator('.brand-logo').getAttribute('src');
    expect(logoSrc, 'header logo should use the new embedded MPW icon').toMatch(/^data:image\/png;base64,/);
    const touchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    expect(touchIcon, 'Apple touch icon should use the same embedded MPW icon').toMatch(/^data:image\/png;base64,/);

    await page.locator('.bottom-nav [data-route="report"]').click();
    const reportText = (await page.locator('#mainContent').innerText()).replace(/\s+/g, ' ');
    expect(reportText).toMatch(/Report date:\s+.+?\s+•\s+Mode:\s+(Early Voting|Election Day)/i);

    await page.screenshot({ path: testInfo.outputPath('daily-report.png'), fullPage: true });
    await assertNoFatalDiagnostics(diagnostics);
  });
});
