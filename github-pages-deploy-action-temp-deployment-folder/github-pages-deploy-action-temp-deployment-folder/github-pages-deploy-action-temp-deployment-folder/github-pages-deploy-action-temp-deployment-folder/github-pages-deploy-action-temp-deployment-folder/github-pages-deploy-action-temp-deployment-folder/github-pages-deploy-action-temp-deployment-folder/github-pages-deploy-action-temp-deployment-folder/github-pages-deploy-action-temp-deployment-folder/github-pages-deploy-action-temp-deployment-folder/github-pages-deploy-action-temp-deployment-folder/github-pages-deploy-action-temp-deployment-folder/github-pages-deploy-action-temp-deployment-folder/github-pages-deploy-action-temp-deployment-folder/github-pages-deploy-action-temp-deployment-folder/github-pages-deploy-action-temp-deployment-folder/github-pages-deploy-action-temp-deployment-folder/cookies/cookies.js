function showCookieAlert() {
  const cookieAlert = document.querySelector('.cookie-alert');
  cookieAlert.style.display = 'block';
}

function hideCookieAlert() {
  const cookieAlert = document.querySelector('.cookie-alert');
  cookieAlert.style.display = 'none';
}

const checkCookieAccepted = () => {
  const cookieAccepted = localStorage.getItem('cookie-accepted');
  if (!cookieAccepted) {
    showCookieAlert();
  } else {
    hideCookieAlert();
  }
};

const acceptCookies = () => {
  localStorage.setItem('cookie-accepted', true);
  hideCookieAlert();
};

document.addEventListener('DOMContentLoaded', checkCookieAccepted);
