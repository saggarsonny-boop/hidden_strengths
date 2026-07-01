// e2e_live_test.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://jobmatch.hive.baby';

test.describe('Jobmatch Production E2E', () => {
  test('Landing page loads with both buttons', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByRole('link', { name: /Discover My Career Match/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /I am Hiring\/Employer Portal/i })).toBeVisible();
  });

  test('Job seeker registration and dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: /Start the Strengths Scan/i }).click();
    // Switch to auth flow
    await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
    const email = `test_user_${Date.now()}@example.com`;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'Password123!');
    await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
    // Wait for onboarding screen
    await expect(page.getByText(/Retake Questionnaire/i)).toBeVisible();
    // Complete minimal onboarding (skip steps)
    await page.getByRole('button', { name: /Save & Continue/i }).click();
    // After onboarding should land on dashboard
    await expect(page.getByText(/Your Strengths Dashboard/i)).toBeVisible();
  });

  test('Employer registration and dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: /I am Hiring\/Employer Portal/i }).click();
    await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
    const email = `emp_user_${Date.now()}@example.com`;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'Password123!');
    // select employer role
    await page.getByRole('button', { name: /Hiring Manager/i }).click();
    await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
    // Employer onboarding form (if fields exist)
    await page.fill('input[name="companyName"]', 'Acme Corp');
    await page.fill('input[name="industry"]', 'Technology');
    await page.getByRole('button', { name: /Save & Continue/i }).click();
    // Should see employer dashboard
    await expect(page.getByText(/Employer Dashboard/i)).toBeVisible();
  });

  test('Stripe checkout flow (mock)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: /Start the Strengths Scan/i }).click();
    // Register a new user
    const email = `pay_user_${Date.now()}@example.com`;
    await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'Password123!');
    await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
    // Complete onboarding
    await page.getByRole('button', { name: /Save & Continue/i }).click();
    // Click upgrade button
    await page.getByRole('button', { name: /Free \(Upgrade\)/i }).click();
    // Wait for mock success redirect with payment param
    await page.waitForURL(/payment=success/);
    await expect(page.getByText(/Payment Successful!/i)).toBeVisible();
  });
});
