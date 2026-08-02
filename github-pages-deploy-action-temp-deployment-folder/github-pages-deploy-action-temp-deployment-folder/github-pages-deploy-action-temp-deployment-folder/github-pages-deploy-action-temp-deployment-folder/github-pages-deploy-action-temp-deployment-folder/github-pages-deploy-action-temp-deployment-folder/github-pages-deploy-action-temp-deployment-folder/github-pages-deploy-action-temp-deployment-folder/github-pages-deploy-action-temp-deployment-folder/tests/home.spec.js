const { test, expect } = require('@playwright/test')

test('home page links to gallery, map, and contact', async ({ page }) => {
	await page.goto('/')
	await expect(page.locator('h1.header')).toContainText('Pracownia Witraży')
	await expect(page.locator('a.galleryImg')).toHaveAttribute('href', './gallery.html')
	await expect(page.locator('a.seeImg')).toHaveAttribute('href', './seeOnMap.html')
	await expect(page.locator('a.contactImg')).toHaveAttribute('href', './contact.html')
})

test('nav menu toggles open and closed', async ({ page }) => {
	await page.goto('/')
	const navList = page.locator('nav ul')
	const toggleBtn = page.locator('.navBtns')

	await expect(navList).not.toHaveClass(/active/)
	await toggleBtn.click()
	await expect(navList).toHaveClass(/active/)
	await toggleBtn.click()
	await expect(navList).not.toHaveClass(/active/)
})
