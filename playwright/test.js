import { test } from '@playwright/test';
import { expect } from '@playwright/test';


function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

function logRequest(interceptedRequest) {
    console.log('A request was made:', interceptedRequest.url());
}



// https://my-dev-store-249512035.store.bcdev
// https://kingshark-test.mybigcommerce.com
const STORE_ROOT_URL = "https://kingshark-test.mybigcommerce.com";
const SHOPPER_EMAIL = 'test123@bc.com';
const SHOPPER_PWD = 'Test123';

test.describe('Sample Test Group', () => {
    test('Login Simple', async ({ page }) => {
        await page.goto(`${STORE_ROOT_URL}/login.php`);

        // Click input[name="login_email"]
        await page.locator('input[name="login_email"]').click();

        // Fill input[name="login_email"]
        await page.locator('input[name="login_email"]').fill(SHOPPER_EMAIL);

        // Click input[name="login_pass"]
        await page.locator('input[name="login_pass"]').click();

        // Fill input[name="login_pass"]
        await page.locator('input[name="login_pass"]').fill(SHOPPER_PWD);

        // Click input:has-text("Sign in")
        await page.locator('input:has-text("Sign in")').click();
        // await expect(page).toHaveURL(`${STORE_ROOT_URL}/account.php?action=order_status`);

        await page.goto(`${STORE_ROOT_URL}/dustpan-brush/`);
        await page.locator('input:has-text("Add to Cart")').click();
        await page.locator('text=Proceed to checkout').click();
        await page.waitForURL(`${STORE_ROOT_URL}/checkout`, { timeout: 50000 });

        // await page.waitForSelector('a[aria-description="Enter or select a different address"]', { timeout: 100000 });
        try {
            await page.waitForSelector('a[aria-description="Enter or select a different address"]', { timeout: 5000 });
            await page.locator('//a[@aria-description="Enter or select a different address"]').click();
            // Click [data-test="add-new-address"]
            await page.locator('[data-test="add-new-address"]').click();
        } catch (error) {
            console.log("The element didn't appear.")
        }

        // Shipping Address
        await page.locator('[data-test="firstNameInput-text"]').click();
        await page.locator('[data-test="firstNameInput-text"]').fill('Test');
        await page.locator('[data-test="lastNameInput-text"]').fill('Joe');
        await page.locator('[data-test="addressLine1Input-text"]').fill('Street ' + generateString(5));
        await page.locator('[data-test="cityInput-text"]').fill('City');
        await page.locator('[data-test="countryCodeInput-select"]').selectOption('AU');
        await page.locator('[data-test="provinceCodeInput-select"]').selectOption('NSW');
        await page.locator('[data-test="postCodeInput-text"]').fill('2000');

        await page.locator('id=checkout-shipping-continue', { timeout: 50000 }).click();

        // Click label:has-text("Pay in Store")
        await page.locator('label:has-text("Pay in Store")').click();

        // Click text=Place Order
        await page.locator('text=Place Order').click();

        // Go to /checkout/order-confirmation
        await page.waitForURL(`${STORE_ROOT_URL}/checkout/order-confirmation`);
    });

    test('Guest Sample', async ({ page }) => {
        await page.goto("https://kingshark-test.mybigcommerce.com/dustpan-brush/");
        await page.locator('input:has-text("Add to Cart")').click();
        await page.locator('text=Proceed to checkout').click();
        await page.waitForURL('https://kingshark-test.mybigcommerce.com/checkout');
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').fill('test@example.com');
        await page.locator('[data-test="customer-continue-as-guest-button"]').click();
        await page.locator('[data-test="customer-guest-continue"]').click();
        await page.locator('[data-test="firstNameInput-text"]').fill('BAD');
        await page.locator('[data-test="lastNameInput-text"]').fill('ROBOT');
        await page.locator('[data-test="addressLine1Input-text"]').fill('1000 5TH AVENUE');
        await page.locator('[data-test="cityInput-text"]').fill('NEW YORK');
        await page.locator('[data-test="countryCodeInput-select"]').selectOption('US');
        await page.locator('[data-test="provinceCodeInput-select"]').selectOption('NY');
        await page.locator('[data-test="postCodeInput-text"]').fill('10028');
        await page.locator('text=Continue').click();
        await page.locator('text=Test Payment Provider').click();
        await page.frameLocator('#bigpaypay-ccNumber iframe').locator('[aria-label="Credit Card Number"]').fill('4111 1111 1111 1111');
        await page.frameLocator('#bigpaypay-ccExpiry iframe').locator('[placeholder="MM \\/ YY"]').fill('11 / 23');
        await page.frameLocator('#bigpaypay-ccName iframe').locator('[aria-label="Name on Card"]').fill('ROBOT');
        await page.frameLocator('#bigpaypay-ccCvv iframe').locator('[aria-label="CVV"]').fill('123');
        await page.locator('text=Place Order').click();
        await page.waitForURL('https://kingshark-test.mybigcommerce.com/checkout/order-confirmation');
    });
});
