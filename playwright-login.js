module.exports = { login };

async function login(page) {
    await page.goto("https://a67e6yxkbb.myprivaterelay.com/smith-journal-13/");
    await page.locator('input:has-text("Add to Cart")').click();
    await page.locator('text=Proceed to checkout').click();
    await page.waitForURL('https://a67e6yxkbb.myprivaterelay.com/checkout');
    // Click [data-test="customer-continue-button"]
    await page.locator('[data-test="customer-continue-button"]').click();
    // Click input[name="email"]
    await page.locator('input[name="email"]').click();
    // Fill input[name="email"]
    await page.locator('input[name="email"]').fill('test@example.com');
    // Click input[name="password"]
    await page.locator('input[name="password"]').click();
    // Fill input[name="password"]
    await page.locator('input[name="password"]').fill('ywM3DDb4D!');
    // Click [data-test="customer-continue-button"]
    await page.locator('[data-test="customer-continue-button"]').click();
}
