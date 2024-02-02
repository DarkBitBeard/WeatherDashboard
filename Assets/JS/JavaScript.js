const apiKey = 'd9c913f34b7f7ad483a86bda33cdc185';
const weatherContainer = document.getElementById('weatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const searchHistoryContainer = document.getElementById('searchHistory');

function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&APPID=${apiKey}`)
        .then(response => response.json())
        .then(currentData => {
            // Display current weather information
            displayCurrentWeather(currentData);

            // Fetch 5-day forecast data
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&APPID=${apiKey}`);
        })
        .then(response => response.json())
        .then(forecastData => {
            // Display 5-day forecast
            displayForecast(forecastData);

            // Add city to search history
            addToSearchHistory(cityInput);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayCurrentWeather(currentData) {
    weatherContainer.innerHTML = `
        <h2>${currentData.name}, ${currentData.sys.country}</h2>
        <p>Date: ${new Date(currentData.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${currentData.main.temp}°C</p>
        <p>Humidity: ${currentData.main.humidity}%</p>
        <p>Wind Speed: ${currentData.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}.png" alt="${currentData.weather[0].description}">
    `;
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    forecastData.list.forEach(item => {
        forecastContainer.innerHTML += `
            <div>
                <h3>${new Date(item.dt * 1000).toLocaleDateString()}</h3>
                <p>Temperature: ${item.main.temp}°C</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind Speed: ${item.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            </div>
        `;
    });
}

function addToSearchHistory(city) {
    const historyItem = document.createElement('div');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => {
        // When a city in the search history is clicked, perform a new search for that city
        document.getElementById('cityInput').value = city;
        searchWeather();
    });

    // Add the history item to the search history container
    searchHistoryContainer.appendChild(historyItem);
}
