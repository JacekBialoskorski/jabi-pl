// ------------------------------------------------------- pobieranie danych
const imgBox = document.querySelector('.imgBox')
const secularBtn = document.querySelector('.secularBtn')
const sacralBtn = document.querySelector('.sacralBtn')
const allBtn = document.querySelector('.allBtn')
let popup = null
let popupImg = null
let popupNameImg = null
let popupPrevBtn = null
let popupNextBtn = null
let popupKeyDownHandler = null
let currentImgUrl = ''
let debounceTimeout
let canPressKey = true

// ------------------------------------------------------- filtrowanie kategorii
function toggleClasses(clickedBtn) {
	sacralBtn.classList.remove('shown')
	secularBtn.classList.remove('shown')
	allBtn.classList.remove('shown')

	clickedBtn.classList.add('shown')
}

// ------------------------------------------------------- mieszanie tablicy
const shuffleArray = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

// ------------------------------------------------------- zmieszanie tablicy świeckich i sakralnych ze ścieżkami i altami
const createArraySecular = () => {
	const shuffledNames = shuffleArray([...GALLERY_MANIFEST.swieckie])
	return shuffledNames.map(name => ({
		thumbPath: `./img/swieckie/thumb/${name}.webp`,
		fullPath: `./img/swieckie/full/${name}.webp`,
		alt: name,
	}))
}
const createArraySacral = () => {
	const shuffledNames = shuffleArray([...GALLERY_MANIFEST.sakralne])
	return shuffledNames.map(name => ({
		thumbPath: `./img/sakralne/thumb/${name}.webp`,
		fullPath: `./img/sakralne/full/${name}.webp`,
		alt: name,
	}))
}
const shuffleBothArrays = () => {
	const secularArr = createArraySecular()
	const sacralArr = createArraySacral()

	const combinedArrays = secularArr.concat(sacralArr)
	const shuffledArrays = shuffleArray(combinedArrays)
	return shuffledArrays
}
// ------------------------------------------------------- wyświetlanie obrazków wg tablic zmieszanych powyżej
const createImgEl = ({ thumbPath, fullPath, alt }) => {
	const img = document.createElement('img')
	img.classList.add('randomImg')
	img.loading = 'lazy'
	Object.assign(img, { src: thumbPath, alt })
	img.dataset.fullSrc = fullPath
	img.addEventListener('click', () => {
		checkExistPopup(fullPath, alt)
	})
	return img
}
const displaySecular = () => {
	const shuffledSecular = createArraySecular()
	imgBox.innerHTML = ''
	shuffledSecular.forEach(item => {
		imgBox.appendChild(createImgEl(item))
	})
}
const displaySacral = () => {
	const shuffledSacral = createArraySacral()
	imgBox.innerHTML = ''
	shuffledSacral.forEach(item => {
		imgBox.appendChild(createImgEl(item))
	})
}
const displayBothArrays = () => {
	const shuffledBoth = shuffleBothArrays()
	imgBox.innerHTML = ''
	shuffledBoth.forEach(item => {
		imgBox.appendChild(createImgEl(item))
	})
}
// ------------------------------------------------------- wywoływanie galerii
displayBothArrays()

// ------------------------------------------------------- nasłuchiwanie przycisków i wywołanie odpowiednich funkcji
secularBtn.addEventListener('click', event => {
	event.preventDefault()
	imgBox.innerHTML = ''
	toggleClasses(secularBtn)
	displaySecular()
})

sacralBtn.addEventListener('click', event => {
	event.preventDefault()
	imgBox.innerHTML = ''
	toggleClasses(sacralBtn)
	displaySacral()
})

allBtn.addEventListener('click', event => {
	event.preventDefault()
	imgBox.innerHTML = ''
	toggleClasses(allBtn)
	displayBothArrays()
})

/* ------------------------------------------------------- 
powiekszanie obrazka po kliku - popup
---------------------------------------------------------- */
const createPopup = (imgUrl, imgAlt) => {
	currentImgUrl = imgUrl
	popup = document.createElement('div')
	popup.className = 'popup'
	popup.style.opacity = '0'
	const img = document.createElement('img')
	img.src = imgUrl
	img.alt = imgAlt
	const closeBtn = document.createElement('button')
	closeBtn.innerHTML = '<i class="far fa-times-circle"></i>'
	closeBtn.className = 'closeBtn'
	const prevBtn = document.createElement('button')
	prevBtn.innerHTML = '<i class="fa-regular fa-circle-left"></i>'
	prevBtn.className = 'prevBtn'
	const nextBtn = document.createElement('button')
	nextBtn.innerHTML = '<i class="fa-regular fa-circle-right">'
	nextBtn.className = 'nextBtn'
	const nameImg = document.createElement('p')
	nameImg.innerHTML = imgAlt
	nameImg.className = 'nameImg'

	popup.appendChild(closeBtn)
	popup.appendChild(prevBtn)
	popup.appendChild(img)
	popup.appendChild(nextBtn)
	popup.appendChild(nameImg)
	document.body.appendChild(popup)

	popupImg = img
	popupNameImg = nameImg
	popupPrevBtn = prevBtn
	popupNextBtn = nextBtn

	setTimeout(() => {
		popup.style.opacity = '1'
		popup.style.transition = 'opacity, ease-out 0.7s '
	}, 100)
	const closePopup = () => {
		document.removeEventListener('keydown', popupKeyDownHandler)
		popupKeyDownHandler = null
		popup.style.opacity = '0'
		setTimeout(() => {
			document.body.removeChild(popup)
			popup = null
			popupImg = null
			popupNameImg = null
			popupPrevBtn = null
			popupNextBtn = null
		}, 250)
	}
	const goToPrev = () => {
		const prevImg = getPrevImg(currentImgUrl)
		if (prevImg) {
			updatePopupImage(prevImg.src, prevImg.alt)
		} else {
			prevBtn.style.cursor = 'not-allowed'
		}
	}
	const goToNext = () => {
		const nextImg = getNextImg(currentImgUrl)
		if (nextImg) {
			updatePopupImage(nextImg.src, nextImg.alt)
		} else {
			nextBtn.style.cursor = 'not-allowed'
		}
	}
	const onKeyDown = e => {
		if (e.key === 'ArrowLeft') {
			goToPrev()
		} else if (e.key === 'ArrowRight') {
			goToNext()
		} else if (e.key === 'Escape') {
			closePopup()
		}
	}
	popupKeyDownHandler = onKeyDown
	document.addEventListener('keydown', popupKeyDownHandler)
	closeBtn.addEventListener('click', closePopup)
	popup.addEventListener('click', event => {
		if (event.target === popup) {
			closePopup()
		}
	})
	prevBtn.addEventListener('click', goToPrev)
	nextBtn.addEventListener('click', goToNext)

	let touchStartX = 0
	let touchStartY = 0
	const swipeThreshold = 50
	const onTouchStart = e => {
		touchStartX = e.changedTouches[0].screenX
		touchStartY = e.changedTouches[0].screenY
	}
	const onTouchEnd = e => {
		const deltaX = e.changedTouches[0].screenX - touchStartX
		const deltaY = e.changedTouches[0].screenY - touchStartY
		if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
			deltaX < 0 ? goToNext() : goToPrev()
		}
	}
	img.addEventListener('touchstart', onTouchStart)
	img.addEventListener('touchend', onTouchEnd)
}
const updatePopupImage = (imgUrl, imgAlt) => {
	currentImgUrl = imgUrl
	popupImg.src = imgUrl
	popupImg.alt = imgAlt
	popupNameImg.innerHTML = imgAlt
	popupPrevBtn.style.cursor = ''
	popupNextBtn.style.cursor = ''
}
const checkExistPopup = (imgUrl, imgAlt) => {
	if (popup) {
		updatePopupImage(imgUrl, imgAlt)
	} else {
		createPopup(imgUrl, imgAlt)
	}
}
const getPrevImg = currentImgUrl => {
	const imgIndex = Array.from(imgBox.querySelectorAll('.randomImg')).findIndex(
		img => img.dataset.fullSrc === currentImgUrl
	)
	if (imgIndex > 0) {
		const prevImg = imgBox.querySelectorAll('.randomImg')[imgIndex - 1]
		return {
			src: prevImg.dataset.fullSrc,
			alt: prevImg.getAttribute('alt'),
		}
	}
	return null
}
const getNextImg = currentImgUrl => {
	const imgIndex = Array.from(imgBox.querySelectorAll('.randomImg')).findIndex(
		img => img.dataset.fullSrc === currentImgUrl
	)
	if (imgIndex < imgBox.querySelectorAll('.randomImg').length - 1) {
		const nextImg = imgBox.querySelectorAll('.randomImg')[imgIndex + 1]
		return {
			src: nextImg.dataset.fullSrc,
			alt: nextImg.getAttribute('alt'),
		}
	}
	return null
}
