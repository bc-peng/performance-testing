# Load Testing using Playwright + Artillery

## Background

We want to make our performance tests easier to author. 
Here is our current approach: https://bc-eng-docs.herokuapp.com/domains/checkout/performance-testing/authoring.html

The brief steps are:
1. We write functional test scripts on different test flow (guest checkout + single shipping address, login checkout + multiple shipping address, etc)
`https://github.com/bigcommerce/bigcommerce/blob/master/tests/Performance/Checkout/Experimental/MinimumViableCheckoutTest.php`

2. Execute the test and record the HTTP requests invoked by the browser, to `.har` file
`https://github.com/bigcommerce/bigcommerce/blob/master/tests/Performance/Checkout/Experimental/MinimumViableCheckoutTest.har`

3. Write a python script to transform the recorded requests into Taurus (YAML) syntax
`https://github.com/bigcommerce/bigcommerce/blob/master/tests/Performance/Checkout/Experimental/MinimumViableCheckoutProcess.py`

4. Use the generated yaml config file to execute loading tests

The pain point is step 3. For each scenario we need to write a transform scripts, to filter / transform from HAR file to pure api request in YAML format.
We want to make it more generic, but it's very hard, since different test scenarios have very different transformer. The author need to fully understand the api's request, response schemas, and the script is vulnerable to any flow changes and api schema changes.

So we want to check if we can get rid of this step. if we can just do step 1, and excute functional tests in a particular load, we directly generate both e2e metrics and api performance.

## Playwright + Artillery

We use Playwright (https://playwright.dev/) to write end to end functional test scripts for any test scenario, since it's easy to use, and have auto generation feature via record our operations. We only need to modify some selectors to make script more robust - We can simply treat it as Selenium alternative

We use Artillery (https://www.artillery.io/) as load-testing platform, to config test phase and loadings (durations, arrival rate, max users, etc)

## Install

### node 16

[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

nvm install 16

nvm use 16

node -v

### dependencies

Run all the following commands in your repo folder

npm run first


## About Scenario Tests

we put shortcut of tests excecution command into package.json, so we can use npm run xxxx to run each script.

### simpleCheckout
This is a scenario on simple guest checkout flow and only include default metrics (end to end metrics).

- playwright test script: `playwright-simpleCheckout.js`
- artillery config: `artillery-simpleCheckout.yml`
- test command: `npm run simple-checkout`
- example of report: `test-run-report-login.json` and `test-run-report-login.json.html`

### loginCheckout
This is a scenario on login checkout flow, and for this test we add listener to all api requests and add to additional metrics for each api performance

- playwright test script: `playwright-loginCheckout.js`
- artillery config: `artillery-loginCheckout.yml`
- test command: `npm run login-checkout`
- example of report: `test-run-report-loginCheckout.json` and `test-run-report-loginCheckout.json.html`

## Miscellaneous

### How to automatically monitor and generate playwright tests script
npx playwright codegen `<url you want to operate>`

### How to write and debug playwright test script
We can put test script into `playwright/test.js` and run in browser: `npx playwright test --headed`

