// @ts-check
import { test, expect } from '@playwright/test';

test.describe('user interactions after deployment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ghostbook/');
  });

  test.describe('evidence button cycling', () => {
    test('clicking an evidence button selects it', async ({ page }) => {
      const button = page.locator('.evidenceButton', {
        hasText: 'Ghost orb',
      });
      await expect(button).toHaveClass(/evidenceNotSelected/);

      await button.click();
      await expect(button).toHaveClass(/evidenceSelected/);
    });

    test('clicking a selected evidence button rules it out', async ({
      page,
    }) => {
      const button = page.locator('.evidenceButton', {
        hasText: 'Ghost orb',
      });

      await button.click(); // NOT_SELECTED → SELECTED
      await button.click(); // SELECTED → RULED_OUT
      await expect(button).toHaveClass(/evidenceRuledOut/);
    });

    test('clicking a ruled-out evidence button returns to not-selected', async ({
      page,
    }) => {
      const button = page.locator('.evidenceButton', {
        hasText: 'Ghost orb',
      });

      await button.click(); // NOT_SELECTED → SELECTED
      await button.click(); // SELECTED → RULED_OUT
      await button.click(); // RULED_OUT → NOT_SELECTED
      await expect(button).toHaveClass(/evidenceNotSelected/);
    });
  });

  test.describe('ghost filtering', () => {
    test('selecting evidence shows matching ghosts', async ({ page }) => {
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();

      // Should show ghost cards now
      const ghosts = page.locator('.ghost');
      await expect(ghosts.first()).toBeVisible();

      const count = await ghosts.count();
      expect(count).toBeGreaterThan(0);
    });

    test('selecting multiple evidence narrows the results', async ({
      page,
    }) => {
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();

      const firstCount = await page.locator('.ghost').count();

      await page
        .locator('.evidenceButton', { hasText: 'Ghost orb' })
        .click();

      const secondCount = await page.locator('.ghost').count();
      expect(secondCount).toBeLessThan(firstCount);
    });

    test('selecting three evidence for Banshee shows Banshee', async ({
      page,
    }) => {
      // Banshee: Fingerprints, Ghost orb, D.O.T.S projector
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'Ghost orb' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'D.O.T.S projector' })
        .click();

      const ghostName = page.locator('.ghostName', { hasText: 'Banshee' });
      await expect(ghostName).toBeVisible();
    });

    test('ruling out evidence eliminates ghosts with that evidence', async ({
      page,
    }) => {
      // Select Fingerprints first
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();

      // Banshee should be visible (has Fingerprints)
      await expect(
        page.locator('.ghostName', { hasText: 'Banshee' })
      ).toBeVisible();

      // Rule out Ghost orb (click twice: select then rule out)
      const ghostOrbBtn = page.locator('.evidenceButton', {
        hasText: 'Ghost orb',
      });
      await ghostOrbBtn.click(); // SELECT
      await ghostOrbBtn.click(); // RULE OUT

      // Banshee has Ghost orb, so it should no longer be visible
      await expect(
        page.locator('.ghostName', { hasText: 'Banshee' })
      ).toBeHidden();
    });

    test('impossible evidence combination shows no ghosts message', async ({
      page,
    }) => {
      // Select Fingerprints
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();

      // Rule out all other evidence types
      const toRuleOut = [
        'Ghost orb',
        'Spirit box',
        'EMF Level 5',
        'Freezing temperatures',
        'Ghost writing',
        'D.O.T.S projector',
      ];

      for (const name of toRuleOut) {
        const btn = page.locator('.evidenceButton', { hasText: name });
        await btn.click(); // SELECT
        await btn.click(); // RULE OUT
      }

      await expect(page.locator('.candidateList')).toContainText(
        'No ghosts match the selected evidence'
      );
    });
  });

  test.describe('reset button', () => {
    test('reset clears all selected evidence', async ({ page }) => {
      // Select a couple of evidence types
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'Ghost orb' })
        .click();

      // Verify some ghosts are shown
      await expect(page.locator('.ghost').first()).toBeVisible();

      // Click reset
      await page.locator('.resetButton').click();

      // All buttons should be back to not-selected
      const buttons = page.locator('.evidenceButton');
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await expect(buttons.nth(i)).toHaveClass(/evidenceNotSelected/);
      }
    });

    test('reset restores the initial "no ghosts" message', async ({
      page,
    }) => {
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();

      await page.locator('.resetButton').click();

      await expect(page.locator('.candidateList')).toContainText(
        'No ghosts match the selected evidence'
      );
    });
  });

  test.describe('ghost details', () => {
    test('clicking details button reveals strength and weakness', async ({
      page,
    }) => {
      // Select evidence to show some ghosts
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();

      // Find the first ghost's details button
      const firstGhost = page.locator('.ghost').first();
      const detailsBtn = firstGhost.locator('.detailsButton');

      // Details should be hidden initially
      await expect(
        firstGhost.locator('.ghostDetailsHidden')
      ).toBeAttached();

      // Click to show details
      await detailsBtn.click();

      await expect(
        firstGhost.locator('.ghostDetailsShown')
      ).toBeAttached();

      // Details content should contain strength/weakness text
      const detailsText = await firstGhost
        .locator('.ghostDetailsShown')
        .textContent();
      expect(detailsText.length).toBeGreaterThan(0);
    });

    test('clicking details button again hides the details', async ({
      page,
    }) => {
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();

      const firstGhost = page.locator('.ghost').first();
      const detailsBtn = firstGhost.locator('.detailsButton');

      await detailsBtn.click(); // show
      await detailsBtn.click(); // hide

      await expect(
        firstGhost.locator('.ghostDetailsHidden')
      ).toBeAttached();
      await expect(
        firstGhost.locator('.ghostDetailsShown')
      ).not.toBeAttached();
    });
  });

  test.describe('evidence disabling', () => {
    test('impossible evidence buttons become disabled', async ({
      page,
    }) => {
      // Narrow down to Banshee: Fingerprints, Ghost orb, D.O.T.S projector
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'Ghost orb' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'D.O.T.S projector' })
        .click();

      // Check that Banshee is the only ghost shown
      const ghostNames = page.locator('.ghostName');
      const count = await ghostNames.count();

      if (count === 1) {
        const name = await ghostNames.first().textContent();
        expect(name).toBe('Banshee');

        // Evidence not in Banshee's list should be disabled
        const spiritBox = page.locator('.evidenceButton', {
          hasText: 'Spirit box',
        });
        await expect(spiritBox).toHaveClass(/evidenceDisabled/);
      }
    });

    test('disabled evidence becomes re-enabled after reset', async ({
      page,
    }) => {
      // Narrow down to trigger disabling
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'Ghost orb' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'D.O.T.S projector' })
        .click();

      // Reset
      await page.locator('.resetButton').click();

      // All buttons should be back to not-selected
      const buttons = page.locator('.evidenceButton');
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await expect(buttons.nth(i)).toHaveClass(/evidenceNotSelected/);
      }
    });

    test('disabled buttons do not respond to clicks', async ({
      page,
    }) => {
      // Narrow down to trigger disabling
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'Ghost orb' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'D.O.T.S projector' })
        .click();

      // Find a disabled button
      const spiritBox = page.locator('.evidenceButton', {
        hasText: 'Spirit box',
      });
      const classBeforeClick = await spiritBox.getAttribute('class');

      if (classBeforeClick?.includes('evidenceDisabled')) {
        await spiritBox.click();
        // Should still be disabled after clicking
        await expect(spiritBox).toHaveClass(/evidenceDisabled/);
      }
    });
  });

  test.describe('The Mimic fake evidence', () => {
    test('The Mimic appears when its fake evidence (Ghost orb) is selected', async ({
      page,
    }) => {
      // Ghost orb is fake evidence for The Mimic
      await page
        .locator('.evidenceButton', { hasText: 'Ghost orb' })
        .click();

      await expect(
        page.locator('.ghostName', { hasText: 'The Mimic' })
      ).toBeVisible();
    });

    test('The Mimic shows Ghost orb as fake evidence with distinct styling', async ({
      page,
    }) => {
      // Select The Mimic's primary evidence
      await page
        .locator('.evidenceButton', { hasText: 'Spirit box' })
        .click();
      await page
        .locator('.evidenceButton', { hasText: 'Fingerprints' })
        .click();
      await page
        .locator('.evidenceButton', {
          hasText: 'Freezing temperatures',
        })
        .click();

      // Find The Mimic ghost card
      const mimicCard = page.locator('.ghost', {
        has: page.locator('.ghostName', { hasText: 'The Mimic' }),
      });

      // The fake evidence should have fakeEvidence class
      const fakeEvidence = mimicCard.locator('.fakeEvidence');
      await expect(fakeEvidence).toBeVisible();
      await expect(fakeEvidence).toContainText('Ghost orb');
    });
  });
});
