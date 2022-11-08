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

    let todoListSaved = document.querySelector('.todo-list').innerHTML;
    localStorage.setItem(`todoListSaved`, todoListSaved);
}

function getLocalStorage() {
    if (localStorage.name) {
        userName.value = localStorage.getItem('name');
    }
    if (localStorage.city) {
        city.value = localStorage.getItem('city');
    }
    if (localStorage.todoListSaved) {
        todoList.innerHTML = localStorage.getItem('todoListSaved')
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
        url = `http://api.openweathermap.org/data/2.5/find?q=${city.value}&lang=en&type=like&APPID=852e5c9d2d3f9c7c5e63661fb0b4c96f&units=metric`
    } else {
        url = `http://api.openweathermap.org/data/2.5/find?q=Tyumen&lang=en&type=like&APPID=852e5c9d2d3f9c7c5e63661fb0b4c96f&units=metric`;
    }
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.list[0].weather[0].id}`);
    temperature.textContent = `${Math.floor(data.list[0].main.temp)}°C`;
    weatherDescription.textContent = `${data.list[0].weather[0].description}`;
    wind.textContent = `Wind speed: ${Math.ceil(data.list[0].wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${Math.ceil(data.list[0].main.humidity)}%`;
}

window.addEventListener('load', getWeather);
city.addEventListener('change', getWeather);

// Quotes
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuoteButton = document.querySelector('.change-quote');

function getRandomQuotesNum() {
    return Math.floor(Math.random() * 100 + 1)
}

async function getQuotes() {
    const quotes = `./script/data.json`;
    const res = await fetch(quotes);
    const data = await res.json();

    let randomQuotesNum = getRandomQuotesNum();
    quote.textContent = data[randomQuotesNum].text;
    author.textContent = data[randomQuotesNum].author;
}

window.addEventListener('load', getQuotes);
changeQuoteButton.addEventListener('click', getQuotes);

// Audio player
// Add song and song list on page
const playList = document.querySelector('.play-list');
const songList = [
    {
        title: 'Aqua Caelestis',
        src: 'assets/sounds/Aqua Caelestis.mp3',
        duration: '00:39',
    },

    {
        title: 'River Flows In You',
        src: 'assets/sounds/River Flows In You.mp3',
        duration: '01:37',
    },

    {
        title: 'Ennio Morricone',
        src: 'assets/sounds/Ennio Morricone.mp3',
        duration: '01:37',
    },

    {
        title: 'Summer Wind',
        src: 'assets/sounds/Summer Wind.mp3',
        duration: '01:50',
    }
]

for (let i = 0; i < songList.length; i++) {
    const li = document.createElement('li');
    li.className = 'play-item';
    li.textContent = songList[i].title;
    playList.append(li);
}

// Add audio player
let isPlay = false;
const playButton = document.querySelector('.play');
const playNextButton = document.querySelector('.play-next');
const playPrevButton = document.querySelector('.play-prev');
const songs = document.querySelectorAll('.play-item');
const songDuration = document.querySelector('.song-time.duration');
const songTiming = document.querySelector('.song-timing');
const volume = document.querySelector('.volume');
const mute = document.querySelector('.mute');

const audio = new Audio();
let i = 0;


function playAudio() {
    audio.src = `${songList[i].src}`;
    if (!songs[i].classList.contains('item-active')) {
        songs[i].classList.add('item-active');
    }
    if (!isPlay) {
        audio.play();
        playButton.classList.toggle('pause');
        isPlay = true;
    } else {
        audio.pause();
        playButton.classList.toggle('pause');
        isPlay = false;
    }
    // Autoplay next song
    function isEnded() {
        if (audio.ended) {
            nextAudio();
        }
        setTimeout(isEnded, 1000);
    }
    isEnded();

    // Duration of song
    function slideSongDuration() {
        let duration = audio.currentTime / audio.duration * 100;
        songDuration.style.width = `${duration}%`;
        let minutes = String(Math.floor(audio.currentTime / 60)).padStart(2, '0');
        let seconds = String(Math.floor(audio.currentTime % 60)).padStart(2, '0');
        songTiming.textContent = `${minutes}:${seconds}`;
        setTimeout(slideSongDuration, 1000);
    }
    slideSongDuration();

    // volume
    function changeVolume() {
        audio.volume = volume.value / 100;
    }
    volume.addEventListener('change', changeVolume);

    // mute
    function muteSong() {
        mute.classList.toggle('active');
        if (!audio.muted) {
            audio.muted = true;
        } else {
            audio.muted = false;
        }
    }
    mute.addEventListener('click', muteSong);
}


function nextAudio() {
    if (i !== songs.length - 1) {
        i++;
        songs[i - 1].classList.remove('item-active');
    } else {
        i = 0;
        songs[songs.length - 1].classList.remove('item-active');
    };
    playAudio();
    playAudio();
}

function prevAudio() {
    if (i !== 0) {
        i--;
        songs[i + 1].classList.remove('item-active');
    } else {
        i = songs.length - 1;
        songs[0].classList.remove('item-active');
    };
    playAudio();
    playAudio();
}

playButton.addEventListener('click', playAudio);
playNextButton.addEventListener('click', nextAudio);
playPrevButton.addEventListener('click', prevAudio);

// Todo list
const todoList = document.querySelector('.todo-list');
const todoInput = document.querySelector('.todo-input');

function createTodoItem() {
    if (todoInput.value) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.textContent = todoInput.value;
        todoList.append(li);
        todoInput.value = ''
    }
}

function markDoneItem(e){
    if (e.target.classList.contains('done')) {
        todoList.removeChild(e.target);
    };
    e.target.classList.add('done');
}

todoInput.addEventListener('change', createTodoItem);
todoList.addEventListener('click', markDoneItem);
