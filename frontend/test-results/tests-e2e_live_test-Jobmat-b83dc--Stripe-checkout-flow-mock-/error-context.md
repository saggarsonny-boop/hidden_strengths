# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e_live_test.spec.js >> Jobmatch Production E2E >> Stripe checkout flow (mock)
- Location: tests\e2e_live_test.spec.js:48:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Start the Strengths Scan/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: ✦
        - generic [ref=e6]: JobMatch
      - generic [ref=e7]:
        - link "Sign in" [ref=e8] [cursor=pointer]:
          - /url: /sign-in
        - link "Find My Career →" [ref=e9] [cursor=pointer]:
          - /url: /onboard
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]: ✦
        - generic [ref=e13]: AI that actually understands you
      - heading "Your weird hobbies are your superpower" [level=1] [ref=e14]
      - paragraph [ref=e15]: Most job boards match your resume. We match your whole life — your hobbies, your personality, your constraints, your story. Then we find you jobs you will actually love.
      - generic [ref=e16]:
        - link "Discover My Career Match →" [ref=e17] [cursor=pointer]:
          - /url: /onboard
        - link "See how it works" [ref=e18] [cursor=pointer]:
          - /url: "#how"
      - paragraph [ref=e19]: Free to start. No resume required. No degree required.
    - generic [ref=e21]:
      - paragraph [ref=e22]: Built for people who do not fit the mold
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]: 🎖️
          - generic [ref=e26]: Veterans
        - generic [ref=e27]:
          - generic [ref=e28]: 🔄
          - generic [ref=e29]: Career Changers
        - generic [ref=e30]:
          - generic [ref=e31]: 🎨
          - generic [ref=e32]: Creative Minds
        - generic [ref=e33]:
          - generic [ref=e34]: 🏋️
          - generic [ref=e35]: Fitness Enthusiasts
        - generic [ref=e36]:
          - generic [ref=e37]: 👩‍👧
          - generic [ref=e38]: Parents Re-entering
        - generic [ref=e39]:
          - generic [ref=e40]: 📚
          - generic [ref=e41]: Self-Taught Learners
        - generic [ref=e42]:
          - generic [ref=e43]: 🔧
          - generic [ref=e44]: Tradespeople
        - generic [ref=e45]:
          - generic [ref=e46]: 🌍
          - generic [ref=e47]: Non-linear Careers
    - generic [ref=e49]:
      - heading "How it works" [level=2] [ref=e50]
      - paragraph [ref=e51]: 5 minutes to unlock careers you never considered
      - generic [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e54]: "01"
          - heading "Tell us everything" [level=3] [ref=e55]
          - paragraph [ref=e56]: Work history, hobbies, personality, lifestyle needs, schedule constraints. The stuff other job sites ignore.
        - generic [ref=e57]:
          - generic [ref=e58]: "02"
          - heading "AI finds your hidden strengths" [level=3] [ref=e59]
          - paragraph [ref=e60]: Our AI reads between the lines. Rock climber means risk assessment. Marathon runner means logistics. The connections most people miss.
        - generic [ref=e61]:
          - generic [ref=e62]: "03"
          - heading "Get matched to real jobs" [level=3] [ref=e63]
          - paragraph [ref=e64]: Ranked matches with match scores, lifestyle fit, and exact job board links. Plus tailored resume and cover letter in seconds.
    - generic [ref=e66]:
      - heading "Real people. Hidden matches found." [level=2] [ref=e67]
      - generic [ref=e68]:
        - generic [ref=e69]:
          - paragraph [ref=e70]: “I never would have thought my marathon training made me a great project manager. The AI saw it instantly.”
          - generic [ref=e71]:
            - paragraph [ref=e72]: Marcus T.
            - paragraph [ref=e73]: "Now: Project Manager"
        - generic [ref=e74]:
          - paragraph [ref=e75]: “4 years in the Air Force, no degree. JobMatch found me 8 roles I was qualified for today.”
          - generic [ref=e76]:
            - paragraph [ref=e77]: Dani R.
            - paragraph [ref=e78]: "Now: Operations Coordinator"
        - generic [ref=e79]:
          - paragraph [ref=e80]: “I listed 'sewing and rock climbing' as hobbies. It matched me to outdoor gear product design.”
          - generic [ref=e81]:
            - paragraph [ref=e82]: Priya K.
            - paragraph [ref=e83]: "Now: Product Designer"
    - generic [ref=e85]:
      - heading "Pay only when you get value" [level=2] [ref=e86]
      - paragraph [ref=e87]: No subscriptions. No monthly fees. Start free.
      - paragraph [ref=e88]: "Free tier: 3 AI job matches + Career DNA profile"
      - generic [ref=e89]:
        - generic [ref=e90]:
          - paragraph [ref=e91]: $5
          - paragraph [ref=e92]: Job Boost
          - paragraph [ref=e93]: 5 more matches + deeper AI analysis
        - generic [ref=e94]:
          - paragraph [ref=e95]: $15
          - paragraph [ref=e96]: Resume Pack
          - paragraph [ref=e97]: Custom resume, cover letter, LinkedIn summary
        - generic [ref=e98]:
          - paragraph [ref=e99]: $29
          - paragraph [ref=e100]: Full Report
          - paragraph [ref=e101]: 20 matches, skill gap roadmap, action plan
        - generic [ref=e102]:
          - paragraph [ref=e103]: $49
          - paragraph [ref=e104]: Blueprint
          - paragraph [ref=e105]: 2 full career paths, salary strategy, network plan
    - generic [ref=e107]:
      - heading "Your career is in there. Let us find it." [level=2] [ref=e108]:
        - text: Your career is in there.
        - text: Let us find it.
      - link "Start Free — Takes 5 Minutes →" [ref=e109] [cursor=pointer]:
        - /url: /onboard
    - contentinfo [ref=e110]:
      - paragraph [ref=e111]:
        - text: JobMatch by
        - link "hive.baby" [ref=e112] [cursor=pointer]:
          - /url: https://hive.baby
        - text: · Built for humans, not resumes
  - alert [ref=e113]
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
  10 |     await expect(page.getByRole('button', { name: /I am Hiring\/Employer Portal/i })).toBeVisible();
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
> 50 |     await page.getByRole('button', { name: /Start the Strengths Scan/i }).click();
     |                                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
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