const apiKey = 'd9c913f34b7f7ad483a86bda33cdc185';
const weatherContainer = document.getElementById('weatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const searchHistoryContainer = document.getElementById('searchHistory');
// Get the audio element
const backgroundMusic = document.getElementById('backgroundMusic');

// Set the volume (0.0 to 1.0, where 0.0 is silent and 1.0 is maximum volume)
backgroundMusic.volume = 0.5; // Set volume to 50%

function searchOnEnter(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
}

function displayErrorMessage() {
    document.getElementById('errorMessage').classList.remove('hidden');
}

function hideErrorMessage() {
    document.getElementById('errorMessage').classList.add('hidden');
}

function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32; // Convert Kelvin to Fahrenheit
}

function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&APPID=${apiKey}`)
        .then(response => response.json())
        .then(currentData => {
            // Convert temperature values from Kelvin to Fahrenheit
            currentData.main.temp = kelvinToFahrenheit(currentData.main.temp);

            // Display current weather information
            displayCurrentWeather(currentData);

            // Fetch 5-day forecast data
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&APPID=${apiKey}`);
        })
        .then(response => response.json())
        .then(forecastData => {
            // Convert temperature values from Kelvin to Fahrenheit for each forecast item
            forecastData.list.forEach(item => {
                item.main.temp = kelvinToFahrenheit(item.main.temp);
            });

            // Display 5-day forecast
            displayForecast(forecastData);

            // Add city to search history
            addToSearchHistory(cityInput);

            // Hide the error message if it was previously displayed
            hideErrorMessage();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Display error message for invalid input or city not found
            displayErrorMessage();
        });
}

function displayCurrentWeather(currentData) {
    // Round down the temperature value
    const temperature = Math.floor(currentData.main.temp);

    weatherContainer.innerHTML = `
        <div class="bg-white rounded-lg p-4 mb-4 text-center font-bold">
            <h2>${currentData.name}, ${currentData.sys.country}</h2>
            <p>Date: ${new Date(currentData.dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: ${temperature}°F</p>
            <p>Humidity: ${currentData.main.humidity}%</p>
            <p>Wind Speed: ${currentData.wind.speed} m/s</p>
            <img src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}.png" alt="${currentData.weather[0].description}">
        </div>
    `;
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';

    // Filter out the current day's forecast
    const currentDate = new Date().toLocaleDateString();
    const filteredForecast = forecastData.list.filter(item => {
        return new Date(item.dt * 1000).toLocaleDateString() !== currentDate;
    });

    // Display forecast for the next four days
    for (let i = 0; i < 4; i++) {
        const item = filteredForecast[i * 8]; // Jump to every next day's forecast (8 items per day)
        // Round down the temperature value
        const temperature = Math.floor(item.main.temp);

        forecastContainer.innerHTML += `
            <div class="bg-white rounded-lg p-4 mb-4">
                <h3>${new Date(item.dt * 1000).toLocaleDateString()}</h3>
                <p>Temperature: ${temperature}°F</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind Speed: ${item.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            </div>
        `;
    }
}

const searchHistorySet = new Set(); // Use a Set to store unique search history items

function addToSearchHistory(city) {
    const lowercaseCity = city.toLowerCase(); // Convert the city name to lowercase

    // Check if the lowercase city is already in the search history
    if (searchHistorySet.has(lowercaseCity)) {
        return; // Don't add duplicate cities
    }

    const historyItem = document.createElement('div');
    historyItem.textContent = city;
    historyItem.classList.add('bg-white', 'rounded-lg', 'p-2', 'mb-2', 'cursor-pointer');

    historyItem.addEventListener('click', () => {
        // When a city in the search history is clicked, perform a new search for that city
        document.getElementById('cityInput').value = city;
        searchWeather();
    });

    // Add the history item to the search history container
    searchHistoryContainer.appendChild(historyItem);

    // Add the lowercase city to the Set to track unique search history items
    searchHistorySet.add(lowercaseCity);
}
