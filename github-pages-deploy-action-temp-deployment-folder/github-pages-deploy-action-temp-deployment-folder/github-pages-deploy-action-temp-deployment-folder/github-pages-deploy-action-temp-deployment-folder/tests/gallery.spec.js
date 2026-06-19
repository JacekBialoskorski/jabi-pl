const { test, expect } = require('@playwright/test')

test('gallery loads images on initial render', async ({ page }) => {
	await page.goto('/gallery.html')
	const images = page.locator('.imgBox img.randomImg')
	await expect(images.first()).toBeVisible()
	expect(await images.count()).toBeGreaterThan(0)
})

test('filter buttons switch between all, secular, and sacral', async ({ page }) => {
	await page.goto('/gallery.html')
	const images = page.locator('.imgBox img.randomImg')
	await expect(images.first()).toBeVisible()
	const allCount = await images.count()

	await page.locator('.secularBtn').click()
	await expect(images.first()).toBeVisible()
	const secularCount = await images.count()
	for (const src of await images.evaluateAll(els => els.map(el => el.getAttribute('src')))) {
		expect(src).toContain('/swieckie/')
	}

	await page.locator('.sacralBtn').click()
	await expect(images.first()).toBeVisible()
	const sacralCount = await images.count()
	for (const src of await images.evaluateAll(els => els.map(el => el.getAttribute('src')))) {
		expect(src).toContain('/sakralne/')
	}

	expect(secularCount + sacralCount).toBe(allCount)

	await page.locator('.allBtn').click()
	await expect(images.first()).toBeVisible()
	expect(await images.count()).toBe(allCount)
})

test('clicking an image opens a popup with zoom and navigation controls', async ({ page }) => {
	await page.goto('/gallery.html')
	const images = page.locator('.imgBox img.randomImg')
	await expect(images.first()).toBeVisible()

	await images.first().click()
	const popup = page.locator('.popup:not(.hide)')
	await expect(popup).toBeVisible()
	await expect(popup.locator('img')).toBeVisible()
	await expect(popup.locator('.prevBtn')).toBeVisible()
	await expect(popup.locator('.nextBtn')).toBeVisible()

	await popup.locator('.nextBtn').click()
	await expect(popup.locator('img')).toBeVisible()

	await popup.locator('.closeBtn').click()
	await expect(page.locator('.popup:not(.hide)')).toHaveCount(0)
})
