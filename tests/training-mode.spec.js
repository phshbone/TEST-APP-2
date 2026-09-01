const { test, expect } = require('@playwright/test');

async function openApp(page) {
  const target = process.env.LIVE_SMOKE_URL;
  expect(target, 'LIVE_SMOKE_URL must be configured').toBeTruthy();
  const response = await page.goto(target, { waitUntil: 'domcontentloaded' });
  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  const gateway = page.getByRole('button', { name: /open the page/i });
  if (await gateway.count()) {
    await gateway.first().click();
    await page.waitForLoadState('domcontentloaded');
  }
  await expect(page.locator('#mainContent')).toBeVisible();
}

async function markAllCheckinLessonsExplained(page) {
  await page.locator('.bottom-nav [data-route="guide"]').click();
  const checkin = page.locator('[data-procedure="checkin"]');
  await expect(checkin).toBeVisible();
  const toggles = checkin.locator('[data-open-lesson]');
  const count = await toggles.count();
  expect(count).toBeGreaterThan(1);

  for (let i = 0; i < count; i += 1) {
    const toggle = toggles.nth(i);
    const key = await toggle.getAttribute('data-open-lesson');
    const card = checkin.locator(`[data-lesson-card="${key}"]`);
    if (!(await card.evaluate(el => el.classList.contains('active')))) await toggle.click();
    const explained = card.locator('[data-lesson-status][data-status="explained"]');
    await expect(explained).toBeVisible();
    if ((await explained.getAttribute('aria-pressed')) !== 'true') await explained.click();
  }
}

function topicRow(page, name) {
  return page.locator('.training-topic-row').filter({ has: page.locator('.training-topic-copy strong', { hasText: name }) });
}

test('Guide-linked Standard Voter Check-In syncs and stays separate by voting mode', async ({ page }) => {
  await openApp(page);

  await page.locator('.mode-button[data-mode="early"]').click();
  await markAllCheckinLessonsExplained(page);
  await page.locator('.bottom-nav [data-route="training"]').click();

  const earlyPreload = topicRow(page, 'Activation-card preload');
  const earlyCheckin = topicRow(page, 'Standard voter check-in');
  await expect(earlyPreload.locator('.training-topic-copy small')).toContainText('Covered');
  await expect(earlyCheckin.locator('.training-topic-copy small')).toContainText('Covered');

  await page.locator('.mode-button[data-mode="election"]').click();
  const electionPreload = topicRow(page, 'Activation-card preload');
  const electionCheckin = topicRow(page, 'Standard voter check-in');
  await expect(electionPreload.locator('.training-topic-copy small')).toHaveText('Not yet marked');
  await expect(electionCheckin.locator('.training-topic-copy small')).toHaveText('Not yet marked');

  await page.locator('.mode-button[data-mode="early"]').click();
  await expect(topicRow(page, 'Activation-card preload').locator('.training-topic-copy small')).toContainText('Covered');
  await expect(topicRow(page, 'Standard voter check-in').locator('.training-topic-copy small')).toContainText('Covered');
});
