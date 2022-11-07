// Date and time outputting
const time = document.querySelector('.time');
const day = document.querySelector('.date');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function showTime() {
    let date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    setTimeout(showTime, 1000);
}

function showDate() {
    let date = new Date();
    const currentDate = date.toLocaleDateString('en-US', options);
    day.textContent = currentDate;
}

showTime();

// Greetings
const greetings = document.querySelector('.greeting');

function getTimeOfDay() {
    let date = new Date();
    let hours = date.getHours();
    if (hours >= 6 && hours <= 11) {
        greetings.textContent = `Good morning,`
        return 'morning';
    }
    if (hours >= 2 && hours <= 17) {
        greetings.textContent = `Good afternoon,`
        return 'afternoon';
    }
    if (hours >= 18 && hours <= 23) {
        greetings.textContent = `Good evening,`
        return 'evening';
    }
    if (hours >= 0 && hours <= 5) {
        greetings.textContent = `Good night,`
        return 'night';
    }
}
getTimeOfDay();


// Input value saving and resize input
const userName = document.querySelector('.name');

function resizeInput() {
    if (userName.value) {
        let inputSize = String(userName.value.length - 4);
        userName.setAttribute('size', `${inputSize}`);
    } else { userName.setAttribute('size', '11'); }
    setTimeout(resizeInput, 200);
}
resizeInput();


// Local storage
function setLocalStorage() {
    localStorage.setItem('name', userName.value);
    localStorage.setItem('city', city.value);
}

function getLocalStorage() {
    if (localStorage.name) {
        userName.value = localStorage.getItem('name');
    }
    if (localStorage.city) {
        city.value = localStorage.getItem('city');
    }
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

// Background changing
const nextButton = document.querySelector('.slide-next');
const prevButton = document.querySelector('.slide-prev');
const timeOfDay = getTimeOfDay();

function getRandomNum() {
    return Math.floor(Math.random() * 20 + 1);
}
let bgNum = String(getRandomNum()).padStart(2, '0');

function getSlideNext() {
    if (bgNum === '20') {
        bgNum = '01';
        setBg();
    } else {
        bgNum = Number(bgNum) + 1;
        bgNum = String(bgNum).padStart(2, '0');
        setBg();
    }
}

function getSlidePrev() {
    if (bgNum === '01') {
        bgNum = '20';
        setBg();
    } else {
        bgNum = Number(bgNum) - 1;
        bgNum = String(bgNum).padStart(2, '0');
        setBg();
    }
}

function setBg() {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
    }
}
setBg();

nextButton.addEventListener('click', getSlideNext);
prevButton.addEventListener('click', getSlidePrev);

// Weather 

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
city.setAttribute('placeholder', 'Tyumen');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');


async function getWeather() {
    let url;
    if (city.value) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=a01750483a59217da99600a7e6738336&units=metric`
    } else { 
        url = `https://api.openweathermap.org/data/2.5/weather?q=Tyumen&lang=en&appid=a01750483a59217da99600a7e6738336&units=metric`;
    }
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    wind.textContent = `Wind speed: ${Math.ceil(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${Math.ceil(data.main.humidity)}%`;
}


window.addEventListener('load', getWeather);
city.addEventListener('change', getWeather);