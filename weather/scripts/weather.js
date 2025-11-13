// Select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const weatherDescription = document.querySelector('#weather-description');
const feelsLike = document.querySelector('#feels-like');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const locationElement = document.querySelector('.location');

// Create required variables for the URL
// IMPORTANT: Replace with your actual OpenWeatherMap API key
// You can get a free API key from https://home.openweathermap.org/api_keys
const myKey = "1fed32d8072da2eb125ef6bcd432e64f"; // This is the example key from the video
const myLat = "49.75";
const myLong = "6.64";

// Construct the full URL using template literals
// Using the Current Weather Data API (2.5) as shown in the video
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${myKey}&units=imperial`;

// Display loading state
function showLoading() {
  currentTemp.textContent = 'Loading...';
  weatherDescription.textContent = 'Fetching weather data';
  feelsLike.textContent = '--°F';
  humidity.textContent = '--%';
  windSpeed.textContent = '-- mph';
}

// Display error message
function displayError(message = 'Unable to fetch weather data') {
  currentTemp.textContent = '--°F';
  weatherDescription.textContent = message;
  feelsLike.textContent = '--°F';
  humidity.textContent = '--%';
  windSpeed.textContent = '-- mph';
  
  // Clear weather icon
  weatherIcon.setAttribute('src', '');
  weatherIcon.setAttribute('alt', 'Weather icon not available');
}

// Fetch weather data from API
async function apiFetch() {
  showLoading();
  
  try {
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Weather data:', data); // For debugging
      displayResults(data);
    } else {
      // Handle different HTTP error statuses
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (response.status === 404) {
        throw new Error('Weather data not found for the specified location.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    displayError(error.message);
  }
}

// Display the JSON data on the web page
function displayResults(data) {
  // Update temperature
  currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;
  
  // Update weather description
  const desc = data.weather[0].description;
  weatherDescription.textContent = desc;
  
  // Update weather icon
  const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc);
  
  // Update additional weather details
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°F`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${Math.round(data.wind.speed)} mph`;
  
  // Update location with actual data from API
  locationElement.textContent = data.name;
}

// Start the process when the page loads
document.addEventListener('DOMContentLoaded', function() {
  apiFetch();
});