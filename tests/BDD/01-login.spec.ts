import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────
// This is our fake login app
// In real life this would be your actual website
// We build it ourselves so we control everything
// ─────────────────────────────────────────────────
const LOGIN_PAGE = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Login</title>
    <style>
      body { font-family: Arial; padding: 40px; max-width: 400px; }
      input { display: block; width: 100%; padding: 10px; 
              margin: 10px 0; font-size: 16px; }
      button { padding: 10px 20px; background: #0070f3; 
               color: white; border: none; font-size: 16px; 
               cursor: pointer; width: 100%; }
      .success { color: green; font-weight: bold; }
      .error   { color: red;   font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Welcome Back</h1>

    <input id="email"    type="email"    placeholder="Email address" />
    <input id="password" type="password" placeholder="Password"      />
    <button id="loginBtn">Login</button>

    <p id="successMsg" class="success" style="display:none">
      Welcome Alice! Login successful.
    </p>
    <p id="errorMsg" class="error" style="display:none">
      Invalid email or password. Please try again.
    </p>
    <p id="emptyMsg" class="error" style="display:none">
      Please fill in all fields before logging in.
    </p>

    <script>
      document.getElementById('loginBtn').addEventListener('click', () => {
        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Hide all messages first
        document.getElementById('successMsg').style.display = 'none';
        document.getElementById('errorMsg').style.display   = 'none';
        document.getElementById('emptyMsg').style.display   = 'none';

        // Check what happened
        if (!email || !password) {
          document.getElementById('emptyMsg').style.display = 'block';
        } else if (email === 'alice@example.com' && password === 'password123') {
          document.getElementById('successMsg').style.display = 'block';
        } else {
          document.getElementById('errorMsg').style.display = 'block';
        }
      });
    </script>
  </body>
  </html>
`;

// ══════════════════════════════════════════════════
// SCENARIO 1 — Successful Login
// The happy path — everything goes right
// ══════════════════════════════════════════════════
test(
  'GIVEN a registered user | WHEN they enter correct credentials | THEN they see a welcome message',
  async ({ page }) => {

  // GIVEN — the login page is open and ready
  await page.setContent(LOGIN_PAGE);

  // WHEN — the user types correct email and password and clicks login
  await page.locator('#email').fill('alice@example.com');
  await page.locator('#password').fill('password123');
  await page.locator('#loginBtn').click();

  // THEN — success message appears and error is hidden
  await expect(page.locator('#successMsg')).toBeVisible();
  await expect(page.locator('#successMsg')).toContainText('Welcome Alice');
  await expect(page.locator('#errorMsg')).toBeHidden();
  await expect(page.locator('#emptyMsg')).toBeHidden();
});


// ══════════════════════════════════════════════════
// SCENARIO 2 — Wrong Password
// Testing that wrong input is handled correctly
// ══════════════════════════════════════════════════
test(
  'GIVEN a user | WHEN they enter a wrong password | THEN they see an error message',
  async ({ page }) => {

  // GIVEN — login page is loaded
  await page.setContent(LOGIN_PAGE);

  // WHEN — correct email but wrong password
  await page.locator('#email').fill('alice@example.com');
  await page.locator('#password').fill('wrongpassword');
  await page.locator('#loginBtn').click();

  // THEN — error message appears
  await expect(page.locator('#errorMsg')).toBeVisible();
  await expect(page.locator('#errorMsg')).toContainText('Invalid email or password');
  await expect(page.locator('#successMsg')).toBeHidden();
});


// ══════════════════════════════════════════════════
// SCENARIO 3 — Empty Form Submission
// Testing defensive behaviour
// ══════════════════════════════════════════════════
test(
  'GIVEN an empty form | WHEN the user clicks login | THEN they are asked to fill all fields',
  async ({ page }) => {

  // GIVEN — login page loaded, nothing typed
  await page.setContent(LOGIN_PAGE);

  // WHEN — user clicks login without typing anything
  await page.locator('#loginBtn').click();

  // THEN — empty field warning appears
  await expect(page.locator('#emptyMsg')).toBeVisible();
  await expect(page.locator('#emptyMsg')).toContainText('Please fill in all fields');
  await expect(page.locator('#successMsg')).toBeHidden();
  await expect(page.locator('#errorMsg')).toBeHidden();
});



// //Wrong test case :-
// test(
//   'GIVEN an empty form | WHEN the user clicks login | THEN they are asked to fill all fields',
//   async ({ page }) => {

//   await page.setContent(LOGIN_PAGE);

//   await page.locator('#loginBtn').click();

//   await expect(page.locator('#emptyMsg')).toBeVisible();
//   await expect(page.locator('#emptyMsg')).toContainText('Please fill in all fields');
//   await expect(page.locator('#successMsg')).toBeHidden();
//   await expect(page.locator('#errorMsg')).toBeHidden();
// });