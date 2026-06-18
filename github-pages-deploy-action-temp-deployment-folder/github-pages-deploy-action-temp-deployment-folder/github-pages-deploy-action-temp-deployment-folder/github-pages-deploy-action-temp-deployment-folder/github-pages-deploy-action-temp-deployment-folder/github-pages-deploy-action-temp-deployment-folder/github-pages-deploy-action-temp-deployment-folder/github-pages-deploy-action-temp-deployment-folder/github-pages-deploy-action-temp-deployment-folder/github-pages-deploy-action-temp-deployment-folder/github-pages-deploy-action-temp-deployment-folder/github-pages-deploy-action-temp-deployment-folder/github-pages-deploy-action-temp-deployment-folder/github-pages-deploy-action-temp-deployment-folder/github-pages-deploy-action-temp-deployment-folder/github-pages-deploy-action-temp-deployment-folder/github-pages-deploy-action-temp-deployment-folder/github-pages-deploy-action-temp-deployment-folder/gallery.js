const URL_SAKRALNE =
	'https://api.imgix.com/api/v1/sources/ID_SOURCE/assets'
const URL_SWIECKIE =
	'https://api.imgix.com/api/v1/sources/ID_SOURCE/assets'
const API_KEY =
	'API_KEY'

let allPhotos = document.querySelector('.all')
const sacralPhotos = document.querySelector('.sacral')
const secularPhotos = document.querySelector('.secular')
const imgBox = document.querySelector('.randomGallery')

const fetchWithDelay = (url, options, delay) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			fetch(url, options)
				.then(response => resolve(response))
				.catch(error => reject(error))
		}, delay)
	})
}

const fetchSacralPhotos = () => {
	fetchWithDelay(
		URL_SAKRALNE,
		{
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json',
				Authorization: `Bearer ${API_KEY}`,
				'Content-Type': 'application/vnd.api+json',
			},
		},
		1000
	)
		.then(response => response.json())
		.then(data => {
			if (!data) return
			const arrLength = data.data.length
			const arr = Array.from({ length: arrLength }, (_, index) => index)
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[arr[i], arr[j]] = [arr[j], arr[i]]
			}
			for (let i = 0; i < arrLength; i++) {
				const linkPhoto = data.data[arr[i]].attributes.origin_path
				const image = document.createElement('img')
				image.classList.add('randomImg')
				image.setAttribute(
					'src',
					`https://jabi-pl-assets-sakralne.imgix.net${linkPhoto}`
				)
				imgBox.appendChild(image)

				// Opóźnienie między kolejnymi żądaniami (np. 1 sekunda)
				setTimeout(() => {
					// Twój kod do wykonania po opóźnieniu
				}, 1000 * (i + 1))
			}

			console.log(imgBox)
		})
		.catch(error => {
			console.error('Download error', error)
		})
}

//   const fetchSecularPhotos = () => {
//     fetchWithDelay(
//       URL_SWIECKIE,
//       {
//         method: 'GET',
//         headers: {
//           Accept: 'application/vnd.api+json',
//           Authorization: `Bearer ${API_KEY}`,
//           'Content-Type': 'application/vnd.api+json',
//         },
//       },
//       1000
//     )
//       .then(response => response.json())
//       .then(data => {
//         if (!data) return;
//         const arrLength = data.data.length;
//         const arr = Array.from({ length: arrLength }, (_, index) => index);
//         for (let i = arr.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [arr[i], arr[j]] = [arr[j], arr[i]];
//         }
//         for (let i = 0; i < arrLength; i++) {
//           const linkPhoto = data.data[arr[i]].attributes.origin_path;
//           const image = document.createElement('img');
//           image.classList.add('randomImg');
//           image.setAttribute(
//             'src',
//             `https://jabi-pl-assets-sweckie.imgix.net${linkPhoto}`
//           );
//           imgBox.appendChild(image);

//           // Opóźnienie między kolejnymi żądaniami (np. 1 sekunda)
//           setTimeout(() => {
//             // Twój kod do wykonania po opóźnieniu
//           }, 1000 * (i + 1));
//         }

//         console.log(imgBox);
//       })
//       .catch(error => {
//         console.error('Download error', error);
//       });
//   };

sacralPhotos.addEventListener('click', event => {
	event.preventDefault()
	imgBox.innerHTML = ''
	fetchSacralPhotos()
})
// secularPhotos.addEventListener('click', event => {
// 	event.preventDefault()
// 	imgBox.innerHTML = ''
// 	fetchSecularPhotos()
// })
// allPhotos.addEventListener('click', event => {
// 	event.preventDefault()
// 	imgBox.innerHTML = ''
// 	fetchPhotos(currentPage)
// })
