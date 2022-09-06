module.exports = { enterCheckout };

async function enterCheckout(page) {
    await page.goto("https://a67e6yxkbb.myprivaterelay.com/smith-journal-13/");
    await page.locator('input:has-text("Add to Cart")').click();
    await page.locator('text=Proceed to checkout').click();
    await page.waitForURL('https://a67e6yxkbb.myprivaterelay.com/checkout');
}

