const { test, expect } = require('@playwright/test')

test('contact page shows company data and a directions map', async ({ page }) => {
	await page.goto('/contact.html')
	await expect(page.locator('.companyData')).toContainText('Krzyżańskiego')
	await expect(page.locator('.companyData')).toContainText('Kraków')

	const iframe = page.locator('.contentContact iframe')
	await expect(iframe).toBeVisible()
	await expect(iframe).toHaveAttribute('src', /google\.com\/maps\/embed/)
})

test('seeOnMap page shows the works-location map', async ({ page }) => {
	await page.goto('/seeOnMap.html')
	const iframe = page.locator('.contentSee iframe')
	await expect(iframe).toBeVisible()
	await expect(iframe).toHaveAttribute('src', /google\.com\/maps\/d\/embed/)
})
