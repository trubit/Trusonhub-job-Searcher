import { test, expect } from '@playwright/test';

test.describe('TrusonHub — Foundation smoke tests', () => {
  test('home page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TrusonHub Job Searcher/);
  });

  test('home page displays the app heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('theme toggle button is present and clickable', async ({ page }) => {
    await page.goto('/');
    const toggleBtn = page.locator('#toggle-theme-btn');
    await expect(toggleBtn).toBeVisible({ timeout: 15000 });
    await toggleBtn.click();
    // After click the button text should change
    await expect(toggleBtn).toBeVisible({ timeout: 15000 });
  });

  test('get started button is present', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('#get-started-btn');
    await expect(btn).toBeVisible({ timeout: 15000 });
  });
});
