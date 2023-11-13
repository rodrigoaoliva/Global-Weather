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




});
