# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e_live_test.spec.js >> Jobmatch Production E2E >> Landing page loads with both buttons
- Location: tests\e2e_live_test.spec.js:7:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /I am Hiring\/Employer Portal/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /I am Hiring\/Employer Portal/i })

```

```yaml
- navigation:
  - text: ✦ JobMatch
  - link "Sign in":
    - /url: /sign-in
  - link "Find My Career →":
    - /url: /onboard
- text: ✦ AI that actually understands you
- heading "Your weird hobbies are your superpower" [level=1]
- paragraph: Most job boards match your resume. We match your whole life — your hobbies, your personality, your constraints, your story. Then we find you jobs you will actually love.
- link "Discover My Career Match →":
  - /url: /onboard
- link "See how it works":
  - /url: "#how"
- paragraph: Free to start. No resume required. No degree required.
- paragraph: Built for people who do not fit the mold
- text: 🎖️ Veterans 🔄 Career Changers 🎨 Creative Minds 🏋️ Fitness Enthusiasts 👩‍👧 Parents Re-entering 📚 Self-Taught Learners 🔧 Tradespeople 🌍 Non-linear Careers
- heading "How it works" [level=2]
- paragraph: 5 minutes to unlock careers you never considered
- text: "01"
- heading "Tell us everything" [level=3]
- paragraph: Work history, hobbies, personality, lifestyle needs, schedule constraints. The stuff other job sites ignore.
- text: "02"
- heading "AI finds your hidden strengths" [level=3]
- paragraph: Our AI reads between the lines. Rock climber means risk assessment. Marathon runner means logistics. The connections most people miss.
- text: "03"
- heading "Get matched to real jobs" [level=3]
- paragraph: Ranked matches with match scores, lifestyle fit, and exact job board links. Plus tailored resume and cover letter in seconds.
- heading "Real people. Hidden matches found." [level=2]
- paragraph: “I never would have thought my marathon training made me a great project manager. The AI saw it instantly.”
- paragraph: Marcus T.
- paragraph: "Now: Project Manager"
- paragraph: “4 years in the Air Force, no degree. JobMatch found me 8 roles I was qualified for today.”
- paragraph: Dani R.
- paragraph: "Now: Operations Coordinator"
- paragraph: “I listed 'sewing and rock climbing' as hobbies. It matched me to outdoor gear product design.”
- paragraph: Priya K.
- paragraph: "Now: Product Designer"
- heading "Pay only when you get value" [level=2]
- paragraph: No subscriptions. No monthly fees. Start free.
- paragraph: "Free tier: 3 AI job matches + Career DNA profile"
- paragraph: $5
- paragraph: Job Boost
- paragraph: 5 more matches + deeper AI analysis
- paragraph: $15
- paragraph: Resume Pack
- paragraph: Custom resume, cover letter, LinkedIn summary
- paragraph: $29
- paragraph: Full Report
- paragraph: 20 matches, skill gap roadmap, action plan
- paragraph: $49
- paragraph: Blueprint
- paragraph: 2 full career paths, salary strategy, network plan
- heading "Your career is in there. Let us find it." [level=2]
- link "Start Free — Takes 5 Minutes →":
  - /url: /onboard
- contentinfo:
  - paragraph:
    - text: JobMatch by
    - link "hive.baby":
      - /url: https://hive.baby
    - text: · Built for humans, not resumes
- alert
```

# Test source

```ts
  1  | // e2e_live_test.spec.js
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | const BASE_URL = process.env.BASE_URL || 'https://jobmatch.hive.baby';
  5  | 
  6  | test.describe('Jobmatch Production E2E', () => {
  7  |   test('Landing page loads with both buttons', async ({ page }) => {
  8  |     await page.goto(BASE_URL);
  9  |     await expect(page.getByRole('link', { name: /Discover My Career Match/i })).toBeVisible();
> 10 |     await expect(page.getByRole('button', { name: /I am Hiring\/Employer Portal/i })).toBeVisible();
     |                                                                                       ^ Error: expect(locator).toBeVisible() failed
  11 |   });
  12 | 
  13 |   test('Job seeker registration and dashboard', async ({ page }) => {
  14 |     await page.goto(BASE_URL);
  15 |     await page.getByRole('button', { name: /Start the Strengths Scan/i }).click();
  16 |     // Switch to auth flow
  17 |     await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
  18 |     const email = `test_user_${Date.now()}@example.com`;
  19 |     await page.fill('input[type="email"]', email);
  20 |     await page.fill('input[type="password"]', 'Password123!');
  21 |     await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
  22 |     // Wait for onboarding screen
  23 |     await expect(page.getByText(/Retake Questionnaire/i)).toBeVisible();
  24 |     // Complete minimal onboarding (skip steps)
  25 |     await page.getByRole('button', { name: /Save & Continue/i }).click();
  26 |     // After onboarding should land on dashboard
  27 |     await expect(page.getByText(/Your Strengths Dashboard/i)).toBeVisible();
  28 |   });
  29 | 
  30 |   test('Employer registration and dashboard', async ({ page }) => {
  31 |     await page.goto(BASE_URL);
  32 |     await page.getByRole('button', { name: /I am Hiring\/Employer Portal/i }).click();
  33 |     await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
  34 |     const email = `emp_user_${Date.now()}@example.com`;
  35 |     await page.fill('input[type="email"]', email);
  36 |     await page.fill('input[type="password"]', 'Password123!');
  37 |     // select employer role
  38 |     await page.getByRole('button', { name: /Hiring Manager/i }).click();
  39 |     await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
  40 |     // Employer onboarding form (if fields exist)
  41 |     await page.fill('input[name="companyName"]', 'Acme Corp');
  42 |     await page.fill('input[name="industry"]', 'Technology');
  43 |     await page.getByRole('button', { name: /Save & Continue/i }).click();
  44 |     // Should see employer dashboard
  45 |     await expect(page.getByText(/Employer Dashboard/i)).toBeVisible();
  46 |   });
  47 | 
  48 |   test('Stripe checkout flow (mock)', async ({ page }) => {
  49 |     await page.goto(BASE_URL);
  50 |     await page.getByRole('button', { name: /Start the Strengths Scan/i }).click();
  51 |     // Register a new user
  52 |     const email = `pay_user_${Date.now()}@example.com`;
  53 |     await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
  54 |     await page.fill('input[type="email"]', email);
  55 |     await page.fill('input[type="password"]', 'Password123!');
  56 |     await page.getByRole('button', { name: /Sign Up \& Continue/i }).click();
  57 |     // Complete onboarding
  58 |     await page.getByRole('button', { name: /Save & Continue/i }).click();
  59 |     // Click upgrade button
  60 |     await page.getByRole('button', { name: /Free \(Upgrade\)/i }).click();
  61 |     // Wait for mock success redirect with payment param
  62 |     await page.waitForURL(/payment=success/);
  63 |     await expect(page.getByText(/Payment Successful!/i)).toBeVisible();
  64 |   });
  65 | });
  66 | 
```