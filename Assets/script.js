document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('cityInput');
    const searchButton = document.querySelector('.searchButton');
    const historyContainer = document.querySelector('aside');
    const cityName = document.getElementById('cityName');
    const temp = document.getElementById('temp');
    const wind = document.getElementById('wind');
    const humidity = document.getElementById('humidity');
    const forecastContainer = document.getElementById('forecastContainer');

  // OpenWeatherMap API key
  const apiKey = '4e6e807ee59834126e8fdbcfad716167';
  let historyLoaded = false; // Flag to check if history has been loaded

    // Function to get weather data for a given city
    function getWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
            if (!isCityInHistory(city)) {
                addCityToHistory(city);
                saveHistoryToStorage();
            }
        })
        .catch(error => console.error('Error fetching current weather data:', error));

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
    }

    // Function to update current weather data in the UI
    function updateCurrentWeather(weatherData) {
    cityName.textContent = `${weatherData.name} (${new Date().toLocaleDateString()})`;
    temp.textContent = `${weatherData.main.temp}°C`;
    wind.textContent = `${weatherData.wind.speed} m/s`;
    humidity.textContent = `${weatherData.main.humidity}%`;
    }

    // Function to update forecast data in the UI
    function updateForecast(forecastData) {
    forecastContainer.innerHTML = '';

    // Display the forecast for the next 5 days
    for (let i = 0; i < 5; i++) {
        const forecast = forecastData.list[i * 8];
        const forecastResult = document.createElement('div');
        forecastResult.classList.add('forecastResult');

        const date = new Date(forecast.dt * 1000);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;

        forecastResult.innerHTML = `
            <h2>${formattedDate}</h2>
            <p>Temp: <span>${forecast.main.temp}°C</span></p>
            <p>Wind: <span>${forecast.wind.speed} m/s</span></p>
            <p>Humidity: <span>${forecast.main.humidity}%</span></p>
        `;

        forecastContainer.appendChild(forecastResult);
        }
    }

      // Function to check if a city is in the search history
    function isCityInHistory(city) {
      const historyButtons = document.querySelectorAll('.historyButtons');
      return Array.from(historyButtons).some(button => button.textContent.toLowerCase() === city.toLowerCase());
    }

    // Function to add a city to the search history
    function addCityToHistory(city) {
      const newHistoryButton = document.createElement('button');
      newHistoryButton.classList.add('historyButtons');
      newHistoryButton.textContent = city;

      newHistoryButton.addEventListener('click', function () {
          getWeather(city);
      });

      historyContainer.insertBefore(newHistoryButton, historyContainer.secondChild);
    }

    // Function to save the search history to local storage
    function saveHistoryToStorage() {
    const historyButtons = document.querySelectorAll('.historyButtons');
    const cities = Array.from(historyButtons).map(button => button.textContent);
    localStorage.setItem('weatherAppHistory', JSON.stringify(cities));
    }

    // Function to load the search history from local storage
    function loadHistoryFromStorage() {
    const storedHistory = localStorage.getItem('weatherAppHistory');
    if (storedHistory && !historyLoaded) {
        const cities = JSON.parse(storedHistory);
        cities.forEach(city => addCityToHistory(city));
        historyLoaded = true; // Set the flag to true after loading history
    }
    }

    // Event listener for the search button
  searchButton.addEventListener('click', function () {
    const city = searchInput.value.trim();

    if (city !== '') {
        getWeather(city);
    }
    });

    // Event listener for the search history buttons
    historyContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('historyButtons')) {
        const city = event.target.textContent;
        getWeather(city);
    }
    });

    // Function to create HTML for weather icon
  function createWeatherIcon(iconCode, altText) {
    const weatherIconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    const weatherIcon = document.createElement('img');
    weatherIcon.src = weatherIconUrl;
    weatherIcon.alt = altText;
    weatherIcon.classList.add('weatherIcon');
    return weatherIcon.outerHTML;
    }

    // Function to update forecast with weather icons
    function updateForecast(forecastData) {
    forecastContainer.innerHTML = '';

    // Display the forecast for the next 5 days
    for (let i = 0; i < 5; i++) {
        const forecast = forecastData.list[i * 8]; // Retrieve data for each day
        const forecastResult = document.createElement('div');
        forecastResult.classList.add('forecastResult');

        const date = new Date(forecast.dt * 1000);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;

        forecastResult.innerHTML = `
            <h2>${formattedDate}</h2>
            ${createWeatherIcon(forecast.weather[0].icon, forecast.weather[0].description)}
            <p>Temp: <span>${forecast.main.temp}°C</span></p>
            <p>Wind: <span>${forecast.wind.speed} m/s</span></p>
            <p>Humidity: <span>${forecast.main.humidity}%</span></p>
        `;

        forecastContainer.appendChild(forecastResult);
    }
    }

    // Function to update current weather with weather icon
  function updateCurrentWeather(weatherData) {
    const cityNameElement = document.getElementById('cityName');
    cityNameElement.innerHTML = `${weatherData.name} (${new Date().toLocaleDateString()})`; // Set city name and date

    // Get the weather icon code from the API response
    const weatherIconCode = weatherData.weather[0].icon;

    // Construct the URL for the weather icon
    const weatherIconUrl = `http://openweathermap.org/img/w/${weatherIconCode}.png`;

    // Create an image element for the weather icon
    const weatherIcon = document.createElement('img');
    weatherIcon.src = weatherIconUrl;
    weatherIcon.alt = weatherData.weather[0].description; // Alt text can be the weather description
    weatherIcon.classList.add('weatherIcon');

    // Insert the weather icon next to the city name and date
    cityNameElement.appendChild(weatherIcon);

    // Display the temperature, wind, and humidity
    const tempParagraph = document.getElementById('temp');
    tempParagraph.innerHTML = `Temp: ${weatherData.main.temp}°C`;

    wind.textContent = `Wind: ${weatherData.wind.speed} m/s`;
    humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
    }



    loadHistoryFromStorage();
});
