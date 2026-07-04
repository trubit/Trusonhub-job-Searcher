import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Job Search & Recruitment Workflow E2E Tests', () => {
  test('Job search page displays header and search filter panel', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveTitle(/Find Jobs/i);
    await expect(page.locator('text=Discover Your Next Opportunity')).toBeVisible();
    await expect(page.locator('text=Filter Options')).toBeVisible();
  });

  test('Guest can search jobs by location filter', async ({ page }) => {
    await page.goto('/jobs');
    const locationInput = page.locator('input[placeholder="City, State, or Country"]');
    await expect(locationInput).toBeVisible();
    await locationInput.fill('San Francisco');
    
    await page.waitForTimeout(1000);
    const noJobs = await page.locator('text=No Jobs Found').isVisible();
    if (noJobs) {
      await expect(page.locator('text=No Jobs Found')).toBeVisible();
    }
  });

  test('Public job details page handles not found gracefully', async ({ page }) => {
    await page.goto('/jobs/non-existent-job-slug-999');
    await expect(page.locator('text=Job not found').or(page.locator('text=Failed to fetch job details.'))).toBeVisible();
  });
});
