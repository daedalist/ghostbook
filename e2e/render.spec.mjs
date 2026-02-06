// @ts-check
import { test, expect } from '@playwright/test';

test.describe('page rendering after deployment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/ghostbook/i);
  });

  test('header renders with application name', async ({ page }) => {
    const heading = page.locator('header h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Phasmophobia Ghostbook');
  });

  test('observations section renders', async ({ page }) => {
    const section = page.locator('.observations');
    await expect(section).toBeVisible();
    await expect(section.locator('h1')).toHaveText('My observations');
  });

  test('all seven evidence buttons render', async ({ page }) => {
    const evidenceNames = [
      'Ghost orb',
      'Spirit box',
      'Fingerprints',
      'EMF Level 5',
      'Freezing temperatures',
      'Ghost writing',
      'D.O.T.S projector',
    ];

    for (const name of evidenceNames) {
      const button = page.locator('.evidenceButton', { hasText: name });
      await expect(button).toBeVisible();
    }
  });

  test('evidence buttons start in the not-selected state', async ({
    page,
  }) => {
    const buttons = page.locator('.evidenceButton');
    const count = await buttons.count();
    expect(count).toBe(7);

    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveClass(/evidenceNotSelected/);
    }
  });

  test('reset button renders', async ({ page }) => {
    const reset = page.locator('.resetButton');
    await expect(reset).toBeVisible();
    await expect(reset).toHaveText('Reset');
  });

  test('candidates section renders with heading', async ({ page }) => {
    const section = page.locator('.candidates');
    await expect(section).toBeVisible();
    await expect(section.locator('h1')).toContainText('Possible ghosts');
  });

  test('initial state shows "No ghosts match" message', async ({
    page,
  }) => {
    const message = page.locator('.candidateList');
    await expect(message).toContainText(
      'No ghosts match the selected evidence'
    );
  });

  test('page uses the Cutive Mono font family', async ({ page }) => {
    const body = page.locator('body');
    const fontFamily = await body.evaluate(
      (el) => getComputedStyle(el).fontFamily
    );
    expect(fontFamily.toLowerCase()).toContain('cutive');
  });

  test('no console errors on page load', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });
});
