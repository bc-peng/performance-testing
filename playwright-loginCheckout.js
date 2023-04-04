module.exports = { loginCheckout };

// const STORE_ROOT_URL = "https://my-dev-store-249512035.store.bcdev";
// const SHOPPER_EMAIL = 'test123@bc.com';
// const SHOPPER_PWD = 'Test123';

const STORE_ROOT_URL = "https://kingshark-test.mybigcommerce.com";
const SHOPPER_EMAIL = 'test123@bc.com';
const SHOPPER_PWD = 'Test123';

function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

async function loginCheckout(page, vuContext, events) {

    // listen to all api request sent in the flow
    page.on('requestfinished', function(request){
        url = request.url();
        // console.log('A request was made:', url);

        // filter all irelative request (only record request to same domain)
        if (!url.startsWith(STORE_ROOT_URL)){
            return;
        }

        let requestUrl = url.split('?')[0].substring(0,200);
        let timing = request.timing();

        // TODO: we can group some `requestUrl` by pattern before record metrics 
        // e.g /api/storefront/checkout/aaaa and /api/storefront/checkout/bbbb should be grouped into same `/api/storefront/checkout/:checkoutId` url

        events.emit('counter', `user.request.counter.${requestUrl}`, 1);
        events.emit('histogram', `user.request.timing.${requestUrl}`, timing.responseEnd);
    });

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


    // aside from browser operation to place order shown above, we can also send api request straightly.
    /*
    try {
        const bcData = await page.evaluate('window.BCData');
        const token = bcData.csrf_token;    

        const start = Date.now();

        const status = await page.evaluate(async ([storeRootUrl, token]) => {
            const response = await fetch(`${storeRootUrl}/internalapi/v1/checkout/order`, {
                "headers": {
                    "x-xsrf-token": token
                },
                "method": "POST",
                "credentials": "include"
            });
    
            return response.status;
        }, [STORE_ROOT_URL, token]);
    
        // expect(status).toEqual(201);
        const costMs = (Date.now() - start);

        events.emit('counter', `user.request.counter.orderCreation`, 1);
        events.emit('histogram', `user.request.timing.orderCreation`, costMs);

    } catch (error) {
        console.log(error.message);
    }
    */

    page.removeListener('request', function(){});
}
