const clockContainer = document.querySelector(".header__clock");

function updateClock() {
    const now = new Date();
    clockContainer.textContent = now.toLocaleTimeString('uk');
}

updateClock();
setInterval(updateClock, 1000);