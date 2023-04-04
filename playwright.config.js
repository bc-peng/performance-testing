import { devices } from '@playwright/test'

const config = {
    testDir: './playwright',
    projects: [
        {
            name: 'chromium',
            use: {
                video: 'on',
                trace: 'on',
                ...devices['Desktop Chrome']
            },
            reporter: [
                ['list'],
                ['json', {  outputFile: 'test-results.json' }]
              ],
        },
    ]
}

module.exports = config;
