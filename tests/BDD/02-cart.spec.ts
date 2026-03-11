import { test, expect } from '@playwright/test';

const CART_PAGE = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Shop</title>
    <style>
      body { font-family: Arial; padding: 40px; }
      .product { border: 1px solid #ddd; padding: 15px; 
                 margin: 10px 0; border-radius: 8px; }
      button   { padding: 8px 16px; background: #0070f3; 
                 color: white; border: none; cursor: pointer; 
                 border-radius: 4px; }
      #clearBtn { background: #e00; margin-top: 10px; }
      #cart-items { list-style: none; padding: 0; }
      #cart-items li { padding: 8px; border-bottom: 1px solid #eee; }
    </style>
  </head>
  <body>
    <h1>Our Products</h1>

    <div class="product" id="product-apple">
      <strong>Apple</strong> — $1.00
      <button class="add-btn" data-name="Apple" data-price="1.00">
        Add to Cart
      </button>
    </div>

    <div class="product" id="product-banana">
      <strong>Banana</strong> — $0.50
      <button class="add-btn" data-name="Banana" data-price="0.50">
        Add to Cart
      </button>
    </div>

    <div class="product" id="product-orange">
      <strong>Orange</strong> — $0.75
      <button class="add-btn" data-name="Orange" data-price="0.75">
        Add to Cart
      </button>
    </div>

    <h2>Your Cart</h2>
    <ul id="cart-items"></ul>
    <p>Total: $<span id="total">0.00</span></p>
    <p id="emptyMsg" style="color:gray">Your cart is empty</p>
    <button id="clearBtn">Clear Cart</button>

    <script>
      let total = 0;

      document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const name  = btn.getAttribute('data-name');
          const price = parseFloat(btn.getAttribute('data-price'));
          total = parseFloat((total + price).toFixed(2));

          const li = document.createElement('li');
          li.className = 'cart-item';
          li.textContent = name + ' — $' + price.toFixed(2);
          document.getElementById('cart-items').appendChild(li);
          document.getElementById('total').textContent = total.toFixed(2);
          document.getElementById('emptyMsg').style.display = 'none';
        });
      });

      document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('cart-items').innerHTML = '';
        total = 0;
        document.getElementById('total').textContent = '0.00';
        document.getElementById('emptyMsg').style.display = 'block';
      });
    </script>
  </body>
  </html>
`;

// ══════════════════════════════════════════════════
// SCENARIO 1 — Adding a Single Item
// ══════════════════════════════════════════════════
test(
  'GIVEN products are available | WHEN user adds one item | THEN cart shows that item',
  async ({ page }) => {

  // GIVEN — shop is loaded
  await page.setContent(CART_PAGE);
  await expect(page.locator('.product')).toHaveCount(3);

  // WHEN — user clicks Add to Cart on Apple
  await page.locator('#product-apple .add-btn').click();

  // THEN — cart shows Apple and correct total
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await expect(page.locator('.cart-item').first()).toContainText('Apple');
  await expect(page.locator('#total')).toHaveText('1.00');
});


// ══════════════════════════════════════════════════
// SCENARIO 2 — Adding Multiple Items
// ══════════════════════════════════════════════════
test(
  'GIVEN a shop | WHEN user adds multiple items | THEN total updates correctly',
  async ({ page }) => {

  // GIVEN — shop page ready
  await page.setContent(CART_PAGE);

  // WHEN — user adds Apple ($1.00) and Banana ($0.50)
  await page.locator('#product-apple .add-btn').click();
  await page.locator('#product-banana .add-btn').click();

  // THEN — 2 items in cart, total is $1.50
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('#total')).toHaveText('1.50');
});


// ══════════════════════════════════════════════════
// SCENARIO 3 — Clearing the Cart
// ══════════════════════════════════════════════════
test(
  'GIVEN a user has items in cart | WHEN they clear the cart | THEN cart is empty and total resets',
  async ({ page }) => {

  // GIVEN — user has already added 2 items
  await page.setContent(CART_PAGE);
  await page.locator('#product-apple .add-btn').click();
  await page.locator('#product-orange .add-btn').click();
  await expect(page.locator('.cart-item')).toHaveCount(2); // confirm items exist

  // WHEN — they click Clear Cart
  await page.locator('#clearBtn').click();

  // THEN — cart is empty and total is back to zero
  await expect(page.locator('.cart-item')).toHaveCount(0);
  await expect(page.locator('#total')).toHaveText('0.00');
  await expect(page.locator('#emptyMsg')).toBeVisible();
});


// // WRONG TEST CASE — Intentionally fails
// test(
//   'GIVEN a user has items in cart | WHEN they clear the cart | THEN cart is empty and total resets TEST WITH WRONG CASE',
//   async ({ page }) => {

//   // GIVEN — user has already added 2 items
//   await page.setContent(CART_PAGE);
//   await page.locator('#product-apple .add-btn').click();
//   await page.locator('#product-orange .add-btn').click();
//   await expect(page.locator('.cart-item')).toHaveCount(2);

//   // WHEN — they click Clear Cart
//   await page.locator('#clearBtn').click();

//   // THEN — these are all WRONG on purpose to show failures
//   await expect(page.locator('.cart-item')).toHaveCount(5);   // ❌ wrong: expects 5 but cart has 0
//   await expect(page.locator('#total')).toHaveText('99.99');  // ❌ wrong: expects 99.99 but total is 0.00
//   await expect(page.locator('#emptyMsg')).toBeHidden();      // ❌ wrong: message is actually visible
// });