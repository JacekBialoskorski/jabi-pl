// /* -----------------------------   Nawigacja */

const btnBars = document.querySelector('.fa-bars')
const btnTimes = document.querySelector('.fa-times')
const btns = document.querySelector('.navBtns')
const ul = document.querySelector('nav ul')
let isMenuOpen = false;

const menuToggle = () => {
    btns.classList.toggle('active')
    ul.classList.toggle('active')
    btnBars.classList.toggle('hide')
    btnTimes.classList.toggle('hide')
}
btns.addEventListener('click', menuToggle)

document.addEventListener('click', (e) => {
    if (isMenuOpen && !e.target.closest('nav')) {
        menuToggle()
        isMenuOpen = false;
    }
})
ul.addEventListener('transitionend', () => {
    isMenuOpen = ul.classList.contains('active')
    if (!isMenuOpen) {
        btnBars.classList.remove('hide')
    }
})
