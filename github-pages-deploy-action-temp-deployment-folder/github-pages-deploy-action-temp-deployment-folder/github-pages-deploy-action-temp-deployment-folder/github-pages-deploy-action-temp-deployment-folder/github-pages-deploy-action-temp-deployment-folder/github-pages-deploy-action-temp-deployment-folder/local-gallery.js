// ------------------------------------------------------- stałe globalne
const SACRAL = 139
const SECULAR = 165
const BOTH = SACRAL + SECULAR

// ------------------------------------------------------- pobieranie danych
const imgBox = document.querySelector('.imgBox')
const secularBtn = document.querySelector('.secularBtn')
const sacralBtn = document.querySelector('.sacralBtn')
const allBtn = document.querySelector('.allBtn')
let popup = null
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
	const numbers = Array.from({ length: SECULAR }, (_, i) => i + 1)
	const shuffledNumbers = shuffleArray(numbers)
	const secular = shuffledNumbers.map(number => ({
		imgPath: `./img/swieckie/swieckie${number}.jpg`,
		alt: `swieckie${number}.jpg`,
	}))
	return secular
}
const createArraySacral = () => {
	const numbers = Array.from({ length: SACRAL }, (_, i) => i + 1)
	const shuffledNumbers = shuffleArray(numbers)
	const sacral = shuffledNumbers.map(number => ({
		imgPath: `./img/sakralne/sakralne${number}.jpg`,
		alt: `sakralne${number}.jpg`,
	}))
	return sacral
}
const shuffleBothArrays = () => {
	const secularArr = createArraySecular()
	const sacralArr = createArraySacral()

	const combinedArrays = secularArr.concat(sacralArr)
	const shuffledArrays = shuffleArray(combinedArrays)
	return shuffledArrays
}
// ------------------------------------------------------- wyświetlanie obrazków wg tablic zmieszanych powyżej
const displaySecular = () => {
	const shuffledSecular = createArraySecular()
	imgBox.innerHTML = ''
	shuffledSecular.forEach(({ imgPath, alt }) => {
		const img = document.createElement('img')
		img.classList.add('randomImg')
		imgBox.appendChild(img)
		Object.assign(img, { src: imgPath, alt })
		img.addEventListener('click', () => {
			checkExistPopup(imgPath, alt)
		})
	})
}
const displaySacral = () => {
	const shuffledSacral = createArraySacral()
	imgBox.innerHTML = ''
	shuffledSacral.forEach(({ imgPath, alt }) => {
		const img = document.createElement('img')
		img.classList.add('randomImg')
		imgBox.appendChild(img)
		Object.assign(img, { src: imgPath, alt })
		img.addEventListener('click', () => {
			checkExistPopup(imgPath, alt)
		})
	})
}
const displayBothArrays = () => {
	const shuffledSecular = shuffleBothArrays()
	imgBox.innerHTML = ''
	for (let i = 0; i < BOTH; i++) {
		const { imgPath, alt } = shuffledSecular[i]
		const img = document.createElement('img')
		img.classList.add('randomImg')
		img.setAttribute('src', imgPath)
		img.setAttribute('alt', alt)

		img.addEventListener('click', () => {
			checkExistPopup(imgPath, alt)
		})
		imgBox.appendChild(img)
	}
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

	setTimeout(() => {
		popup.style.opacity = '1'
		popup.style.transition = 'opacity, ease-out 0.7s '
	}, 100)
	// document.addEventListener('keydown', (e) => {
	// 	clearTimeout(debounceTimeout);	  
	// 	if (e.key === 'ArrowLeft') {
	// 	  const prevImg = getPrevImg(imgUrl);
	// 	  checkExistPopup(prevImg.src, prevImg.alt);
	// 	  clearTimeout(debounceTimeout);
	// 	} else if (e.key === 'ArrowRight') {
	// 	  const nextImg = getNextImg(imgUrl);
	// 	  checkExistPopup(nextImg.src, nextImg.alt);
	// 	  clearTimeout(debounceTimeout);
	// 	} else if (e.key === 'Escape') {
	// 	  document.body.removeChild(popup);
	// 	  popup = null;
	// 	  clearTimeout(debounceTimeout);
	// 	}
	// 	// Set a debounce timeout to prevent immediate subsequent key presses
	// 	debounceTimeout = setTimeout(() => {
	// 	  clearTimeout(debounceTimeout);
	// 	}, 50);
	//   });
	closeBtn.addEventListener('click', () => {
		popup.style.opacity = '0'
		setTimeout(() => {
			document.body.removeChild(popup)
			popup = null
		}, 250)
	})
	prevBtn.addEventListener('click', () => {
		const prevImg = getPrevImg(imgUrl)
		if (prevImg) {
			checkExistPopup(prevImg.src, prevImg.alt)
		} else {
			prevBtn.style.cursor = 'not-allowed'
		}
	})
	nextBtn.addEventListener('click', () => {
		const nextImg = getNextImg(imgUrl)
		if (nextImg) {
			checkExistPopup(nextImg.src, nextImg.alt)
		} else {
			nextBtn.style.cursor = 'not-allowed'
		}
	})
}
const checkExistPopup = (imgUrl, imgAlt) => {
	if (popup) {
		document.body.removeChild(popup)
		createPopup(imgUrl, imgAlt)
	} else {
		createPopup(imgUrl, imgAlt)
	}
}
const getPrevImg = currentImgUrl => {
	const imgIndex = Array.from(imgBox.querySelectorAll('.randomImg')).findIndex(
		img => img.getAttribute('src') === currentImgUrl
	)
	if (imgIndex > 0) {
		const prevImg = imgBox.querySelectorAll('.randomImg')[imgIndex - 1]
		return {
			src: prevImg.getAttribute('src'),
			alt: prevImg.getAttribute('alt'),
		}
	}
	return null
}
const getNextImg = currentImgUrl => {
	const imgIndex = Array.from(imgBox.querySelectorAll('.randomImg')).findIndex(
		img => img.getAttribute('src') === currentImgUrl
	)
	if (imgIndex < imgBox.querySelectorAll('.randomImg').length - 1) {
		const nextImg = imgBox.querySelectorAll('.randomImg')[imgIndex + 1]
		return {
			src: nextImg.getAttribute('src'),
			alt: nextImg.getAttribute('alt'),
		}
	}
	return null
}
