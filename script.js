const apiKey = '3ac5c60eae6bdf61ef21ff380fb1999f';
const timezoneApiKey = 'RNGORWDM6ZC5';
let intervalId;

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');

    searchButton.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            fetchWeatherDataByCity(city);
        } else {
            alert('Por favor, digite o nome de uma cidade.');
        }
    });
});

function fetchWeatherDataByCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
            fetchWeatherForecast(data.coord.lat, data.coord.lon);
            fetchTimeDataByCoordinates(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

function fetchWeatherDataByCoordinates(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
            fetchWeatherForecast(lat, lon);
            fetchTimeDataByCoordinates(lat, lon);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

function fetchWeatherForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecast = data.list.find(item => item.dt_txt.includes("12:00:00")); // Previsão do meio-dia para o dia seguinte
            updateForecastInfo(forecast);
        })
        .catch(error => console.error('Erro ao buscar previsão:', error));
}

function updateWeatherInfo(data) {
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const weatherCondition = data.weather[0].main.toLowerCase();
    const iconContainer = document.getElementById('weather-icon');

    document.getElementById('temperature').textContent = `Temperatura: ${temperature}°C`;
    document.getElementById('humidity').textContent = `Umidade: ${humidity}%`;

    iconContainer.className = 'wi'; // Reset class

    switch (weatherCondition) {
        case 'clear':
        case 'sunny':
            iconContainer.classList.add('wi-day-sunny');
            document.body.className = 'sunny';
            break;
        case 'clouds':
        case 'cloudy':
            iconContainer.classList.add('wi-cloudy');
            document.body.className = 'cloudy';
            break;
        case 'rain':
        case 'drizzle':
            iconContainer.classList.add('wi-rain');
            document.body.className = 'rainy';
            break;
        case 'snow':
            iconContainer.classList.add('wi-snow');
            document.body.className = 'snowy';
            break;
        default:
            document.body.style.background = '#f0f0f0';
    }
}

function updateForecastInfo(forecast) {
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const weatherCondition = forecast.weather[0].main.toLowerCase();
    const iconContainer = document.getElementById('forecast-icon');

    document.getElementById('forecast-temperature').textContent = `Temperatura: ${temperature}°C`;
    document.getElementById('forecast-humidity').textContent = `Umidade: ${humidity}%`;

    iconContainer.className = 'wi'; // Reset class

    switch (weatherCondition) {
        case 'clear':
        case 'sunny':
            iconContainer.classList.add('wi-day-sunny');
            break;
        case 'clouds':
        case 'cloudy':
            iconContainer.classList.add('wi-cloudy');
            break;
        case 'rain':
        case 'drizzle':
            iconContainer.classList.add('wi-rain');
            break;
        case 'snow':
            iconContainer.classList.add('wi-snow');
            break;
        default:
            iconContainer.className = '';
    }
}

function fetchTimeDataByCoordinates(lat, lon) {
    fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`)
        .then(response => response.json())
        .then(data => {
            if (intervalId) clearInterval(intervalId);
            const currentTime = new Date(data.formatted);
            intervalId = setInterval(() => {
                currentTime.setSeconds(currentTime.getSeconds() + 1);
                updateTimeInfo(currentTime, data.abbreviation);
            }, 1000); // Atualizar a cada segundo
        })
        .catch(error => console.error('Erro ao buscar dados de tempo:', error));
}

function updateTimeInfo(currentTime, timeZone) {
    const localTime = currentTime.toLocaleTimeString();
    document.getElementById('local-time').textContent = localTime;
    document.getElementById('time-zone').textContent = timeZone;
}


