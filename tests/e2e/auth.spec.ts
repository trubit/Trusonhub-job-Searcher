import { test, expect } from '@playwright/test';

test.describe('Authentication End-to-End User Journeys', () => {
  test('navigates to login page and displays form elements', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
    await expect(page.getByLabel(/Email Address or Username/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('displays validation error when submitting empty login form', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /Sign In/i }).click();

    await expect(page.getByText(/Please enter your email or username/i)).toBeVisible();
    await expect(page.getByText(/Please enter your password/i)).toBeVisible();
  });

  test('navigates to Candidate Registration page', async ({ page }) => {
    await page.goto('/auth/register/job-seeker');

    await expect(page.getByRole('heading', { name: /Candidate Registration/i })).toBeVisible();
    await expect(page.getByLabel(/First Name/i)).toBeVisible();
    await expect(page.getByLabel(/Last Name/i)).toBeVisible();
    await expect(page.getByLabel(/Work Email Address|Email Address/i)).toBeVisible();
  });

  test('navigates to Employer Registration page', async ({ page }) => {
    await page.goto('/auth/register/employer');

    await expect(page.getByRole('heading', { name: /Employer Account/i })).toBeVisible();
    await expect(page.getByLabel(/Company Name/i)).toBeVisible();
  });

  test('navigates to Forgot Password page', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    await expect(page.getByRole('heading', { name: /Reset Password/i })).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
  });
});
