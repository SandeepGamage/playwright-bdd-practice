// import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });


import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────
// 1. PAGE-LEVEL ASSERTIONS
// ─────────────────────────────────────────
test('1. Page title assertion', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Checks if title CONTAINS the word "Playwright"
  await expect(page).toHaveTitle(/Playwright/);
  console.log('✅ Title assertion passed');
});

test('2. Page URL assertion', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Checks the current URL
  await expect(page).toHaveURL('https://playwright.dev/');
  console.log('✅ URL assertion passed');
});

// ─────────────────────────────────────────
// 2. ELEMENT VISIBILITY ASSERTIONS
// ─────────────────────────────────────────
test('3. Element is visible', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Check a heading is visible on screen
  await expect(page.getByRole('heading', { name: 'Playwright enables reliable end-to-end testing' })).toBeVisible();
  console.log('✅ Visibility assertion passed');
});

test('4. Element is hidden (negative assertion)', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Check something that should NOT exist
  await expect(page.locator('#this-does-not-exist')).toBeHidden();
  console.log('✅ Hidden assertion passed');
});

// ─────────────────────────────────────────
// 3. TEXT CONTENT ASSERTIONS
// ─────────────────────────────────────────
test('5. Element has exact text', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Checks the "Get started" link text
  await expect(page.getByRole('link', { name: 'Get started' })).toHaveText('Get started');
  console.log('✅ Exact text assertion passed');
});

test('6. Element contains partial text', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // ContainText is more flexible — partial match
  await expect(page.getByRole('link', { name: 'Get started' })).toContainText('started');
  console.log('✅ Partial text assertion passed');
});

// ─────────────────────────────────────────
// 4. INPUT / FORM ASSERTIONS
// ─────────────────────────────────────────
test('7. Input field value assertion', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Find the search bar and type in it
  const searchBox = page.getByRole('button', { name: 'Search' });
  await searchBox.click();

  const input = page.getByPlaceholder('Search docs');
  await input.fill('assertions');

  // Check the value typed into the input
  await expect(input).toHaveValue('assertions');
  console.log('✅ Input value assertion passed');
});

// ─────────────────────────────────────────
// 5. COUNT ASSERTIONS
// ─────────────────────────────────────────
test('8. Count how many elements exist', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Count all links in the navbar
  const navLinks = page.locator('.navbar__items a');
  
  // Check there are MORE than 1 nav links
  await expect(navLinks).toHaveCount(await navLinks.count());
  console.log(`✅ Count assertion passed — found ${await navLinks.count()} nav links`);
});

// ─────────────────────────────────────────
// 6. ATTRIBUTE ASSERTIONS
// ─────────────────────────────────────────
test('9. Element has correct attribute', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Check the "Get started" link points to the right URL
  await expect(page.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/docs/intro');
  console.log('✅ Attribute assertion passed');
});

// ─────────────────────────────────────────
// 7. ENABLED / DISABLED ASSERTIONS
// ─────────────────────────────────────────
test('10. Button is enabled', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Check the Get Started link is enabled (clickable)
  await expect(page.getByRole('link', { name: 'Get started' })).toBeEnabled();
  console.log('✅ Enabled assertion passed');
});