import { test } from '@playwright/test';

test.describe('Sample Test Group', () => {
    test('Sample 1', async ({page}) => {
        // Put playwright actions below to see it in a browser.
        // command: npx playwright test --headed
        await page.goto("https://a67e6yxkbb.myprivaterelay.com/smith-journal-13/");
        await page.locator('input:has-text("Add to Cart")').click();
        await page.locator('text=Proceed to checkout').click();
        await page.waitForURL('https://a67e6yxkbb.myprivaterelay.com/checkout');
        await page.locator('[data-test="customer-continue-button"]').click();
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').fill('test@example.com');
        await page.locator('input[name="password"]').click();
        await page.locator('input[name="password"]').fill('ywM3DDb4D!');
        await page.locator('[data-test="customer-continue-button"]').click();

        // Wait for an item that is the result of above actions so that playwright won't stop early than expected.
        // You may find this item by using the `explore` button on the playwright inspector.
        await page.waitForSelector('[data-test="sign-out-link"]');
    });
});
