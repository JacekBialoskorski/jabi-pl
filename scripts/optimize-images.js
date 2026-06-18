// Generates web-sized image variants from the full-resolution masters in
// img/originals/<category>/. Run this whenever a photo is added, removed,
// or replaced: `node scripts/optimize-images.js`
//
// Two variants are produced per master, both as compressed WebP:
//   thumb/ - small, for the gallery grid (cheap to load 300+ at once)
//   full/  - larger, only loaded when a user opens the zoom popup
//
// img/originals/ holds the masters and is gitignored - it's the source of
// truth for re-running this script, but isn't shipped to the live site.

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const CATEGORIES = ['swieckie', 'sakralne']
const IMG_ROOT = path.join(__dirname, '..', 'img')

const VARIANTS = {
	thumb: { width: 500, quality: 75 },
	full: { width: 1920, quality: 82 },
}

const processImage = async (srcPath, destDir, variant) => {
	const name = path.parse(srcPath).name
	const destPath = path.join(destDir, `${name}.webp`)
	await sharp(srcPath)
		.resize({ width: variant.width, withoutEnlargement: true })
		.webp({ quality: variant.quality })
		.toFile(destPath)
}

const processCategory = async category => {
	const sourceDir = path.join(IMG_ROOT, 'originals', category)
	const files = fs
		.readdirSync(sourceDir)
		.filter(file => /\.(jpe?g|png)$/i.test(file))

	for (const [variantName, variant] of Object.entries(VARIANTS)) {
		const destDir = path.join(IMG_ROOT, category, variantName)
		fs.mkdirSync(destDir, { recursive: true })
		for (const file of files) {
			await processImage(path.join(sourceDir, file), destDir, variant)
		}
		console.log(`${category}/${variantName}: ${files.length} images`)
	}
}

const main = async () => {
	for (const category of CATEGORIES) {
		await processCategory(category)
	}
}

main()
