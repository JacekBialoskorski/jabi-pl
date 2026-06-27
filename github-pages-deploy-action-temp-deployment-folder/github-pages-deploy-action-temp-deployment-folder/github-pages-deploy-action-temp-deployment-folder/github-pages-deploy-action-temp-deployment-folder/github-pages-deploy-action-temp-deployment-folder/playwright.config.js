const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
	testDir: './tests',
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:4173',
	},
	webServer: {
		command: 'npx serve . -l 4173',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
})
