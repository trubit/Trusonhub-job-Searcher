import { test, expect } from '@playwright/test';

test.describe('Phase 4 — Candidate Profile & Company Management E2E Tests', () => {
  test('Candidate public profile page renders properly', async ({ page }) => {
    await page.goto('/profile/alexdev');
    await expect(page).toHaveTitle(/Candidate Profile/i);
  });

  test('Public company profile page handles 404 gracefully', async ({ page }) => {
    await page.goto('/company/non-existent-company-slug-999');
    await expect(page.locator('text=Company Not Found')).toBeVisible();
  });
});
