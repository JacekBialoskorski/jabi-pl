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

test('navigating to the next photo updates the popup in place instead of recreating it', async ({ page }) => {
	await page.goto('/gallery.html')
	const images = page.locator('.imgBox img.randomImg')
	await images.first().click()

	const popup = page.locator('.popup:not(.hide)')
	await expect(popup).toBeVisible()
	await popup.evaluate(el => el.setAttribute('data-test-marker', 'kept'))
	const firstSrc = await popup.locator('img').getAttribute('src')

	await popup.locator('.nextBtn').click()
	await expect(popup.locator('img')).not.toHaveAttribute('src', firstSrc)
	await expect(popup).toHaveAttribute('data-test-marker', 'kept')
})

test('arrow keys navigate the popup and escape closes it', async ({ page }) => {
	await page.goto('/gallery.html')
	const images = page.locator('.imgBox img.randomImg')
	await images.first().click()

	const popup = page.locator('.popup:not(.hide)')
	const popupImg = popup.locator('img')
	const firstSrc = await popupImg.getAttribute('src')

	await page.keyboard.press('ArrowRight')
	await expect(popupImg).not.toHaveAttribute('src', firstSrc)

	await page.keyboard.press('ArrowLeft')
	await expect(popupImg).toHaveAttribute('src', firstSrc)

	await page.keyboard.press('Escape')
	await expect(page.locator('.popup:not(.hide)')).toHaveCount(0)
})

test('swiping left and right navigates the zoomed photo', async ({ page }) => {
	await page.goto('/gallery.html')
	const images = page.locator('.imgBox img.randomImg')
	await images.first().click()

	const popup = page.locator('.popup:not(.hide)')
	const popupImg = popup.locator('img')
	const firstSrc = await popupImg.getAttribute('src')

	const swipe = (startX, endX) =>
		page.evaluate(({ startX, endX }) => {
			const img = document.querySelector('.popup:not(.hide) img')
			const start = new Event('touchstart')
			start.changedTouches = [{ screenX: startX, screenY: 100 }]
			img.dispatchEvent(start)

			const end = new Event('touchend')
			end.changedTouches = [{ screenX: endX, screenY: 100 }]
			img.dispatchEvent(end)
		}, { startX, endX })

	await swipe(300, 100)
	await expect(popupImg).not.toHaveAttribute('src', firstSrc)

	await swipe(100, 300)
	await expect(popupImg).toHaveAttribute('src', firstSrc)
})
