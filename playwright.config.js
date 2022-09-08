import { devices } from '@playwright/test'

const config = {
    testDir: './playwright',
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            },
        },
    ]
}

module.exports = config;
