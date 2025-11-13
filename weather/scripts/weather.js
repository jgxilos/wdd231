// Select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const weatherDescription = document.querySelector('#weather-description');
const feelsLike = document.querySelector('#feels-like');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const locationElement = document.querySelector('.location');

// Create required variables for the URL
const myKey = "cc40abbda084a65b6b7d8fef585aee01"; // API key
const myLat = "49.75";
const myLong = "6.64";

// Construct the full URL using template literals
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${myKey}&units=imperial`;

// Display loading state
function showLoading() {
  currentTemp.textContent = 'Loading...';
  weatherDescription.textContent = 'Fetching weather data';
  feelsLike.textContent = '--°F';
  humidity.textContent = '--%';
  windSpeed.textContent = '-- mph';
}

// Fetch weather data from API
async function apiFetch() {
  showLoading();
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayResults(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
    displayError();
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

// Display error message
function displayError() {
  currentTemp.textContent = '--°F';
  weatherDescription.textContent = 'Unable to fetch weather data';
  feelsLike.textContent = '--°F';
  humidity.textContent = '--%';
  windSpeed.textContent = '-- mph';
}

// Start the process
apiFetch();