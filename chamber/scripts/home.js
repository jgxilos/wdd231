/* ========================================
   CHAMBER HOME PAGE - JAVASCRIPT
   Weather API and Member Spotlights
   ======================================== */

// ========================================
// WEATHER API CONFIGURATION
// ========================================
// Coordinates for Juan José Mora, Venezuela (approximate)
const myLat = "10.2333";
const myLong = "-68.0000";
const myKey = "1fed32d8072da2eb125ef6bcd432e64f"; // OpenWeatherMap API key

// API URLs
const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${myKey}&units=imperial`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLong}&appid=${myKey}&units=imperial`;

// ========================================
// DOM ELEMENTS
// ========================================
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const weatherDescription = document.querySelector('#weather-description');
const feelsLike = document.querySelector('#feels-like');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const forecastGrid = document.querySelector('#forecast-grid');
const spotlightsList = document.querySelector('#spotlights-list');

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData();
    fetchForecastData();
    loadSpotlights();
});

// ========================================
// WEATHER: CURRENT CONDITIONS
// ========================================
async function fetchWeatherData() {
    showWeatherLoading();
    
    try {
        const response = await fetch(currentWeatherUrl);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key');
            } else if (response.status === 404) {
                throw new Error('Location not found');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const data = await response.json();
        console.log('Current weather data:', data);
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayWeatherError(error.message);
    }
}

function showWeatherLoading() {
    if (currentTemp) currentTemp.textContent = 'Loading...';
    if (weatherDescription) weatherDescription.textContent = 'Fetching weather data';
    if (feelsLike) feelsLike.textContent = '--°F';
    if (humidity) humidity.textContent = '--%';
    if (windSpeed) windSpeed.textContent = '-- mph';
}

function displayWeatherData(data) {
    // Update temperature
    if (currentTemp) {
        currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;
    }
    
    // Update weather description
    if (weatherDescription) {
        const desc = data.weather[0].description;
        // Capitalize first letter of each word
        weatherDescription.textContent = desc.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    // Update weather icon
    if (weatherIcon) {
        const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.setAttribute('src', iconsrc);
        weatherIcon.setAttribute('alt', data.weather[0].description);
    }
    
    // Update high/low temperatures
    const tempHigh = document.getElementById('temp-high');
    const tempLow = document.getElementById('temp-low');
    if (tempHigh) tempHigh.textContent = `${Math.round(data.main.temp_max)}°`;
    if (tempLow) tempLow.textContent = `${Math.round(data.main.temp_min)}°`;
    
    // Update humidity
    if (humidity) {
        humidity.textContent = `${data.main.humidity}%`;
    }
    
    // Update sunrise/sunset
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    if (sunrise) {
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    if (sunset) {
        const sunsetTime = new Date(data.sys.sunset * 1000);
        sunset.textContent = sunsetTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
}

function displayWeatherError(message) {
    if (currentTemp) currentTemp.textContent = '--°F';
    if (weatherDescription) weatherDescription.textContent = message;
    if (feelsLike) feelsLike.textContent = '--°F';
    if (humidity) humidity.textContent = '--%';
    if (windSpeed) windSpeed.textContent = '-- mph';
    if (weatherIcon) {
        weatherIcon.setAttribute('src', '');
        weatherIcon.setAttribute('alt', 'Weather icon not available');
    }
}

// ========================================
// WEATHER: 3-DAY FORECAST
// ========================================
async function fetchForecastData() {
    try {
        const response = await fetch(forecastUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Forecast data:', data);
        displayForecastData(data);
        
    } catch (error) {
        console.error('Error fetching forecast:', error);
        displayForecastError();
    }
}

function displayForecastData(data) {
    // Simple forecast display for Today, Wednesday, Thursday
    const forecastToday = document.getElementById('forecast-today');
    const forecastWed = document.getElementById('forecast-wed');
    const forecastThu = document.getElementById('forecast-thu');
    
    if (!forecastToday || !forecastWed || !forecastThu) return;
    
    // Get forecasts for next 3 days
    const forecasts = [];
    const today = new Date().getDate();
    
    for (let item of data.list) {
        const forecastDate = new Date(item.dt * 1000);
        const forecastDay = forecastDate.getDate();
        
        // Skip today's forecast, get next 3 days
        if (forecastDay === today) continue;
        
        // Check if we already have a forecast for this day
        const alreadyHasDay = forecasts.some(f => {
            const existingDate = new Date(f.dt * 1000);
            return existingDate.getDate() === forecastDay;
        });
        
        if (!alreadyHasDay) {
            forecasts.push(item);
        }
        
        if (forecasts.length === 3) break;
    }
    
    // Display temperatures
    if (forecasts[0]) {
        forecastToday.textContent = `${Math.round(forecasts[0].main.temp)}°F`;
    }
    if (forecasts[1]) {
        forecastWed.textContent = `${Math.round(forecasts[1].main.temp)}°F`;
    }
    if (forecasts[2]) {
        forecastThu.textContent = `${Math.round(forecasts[2].main.temp)}°F`;
    }
}

function displayForecastError() {
    if (!forecastGrid) return;
    
    forecastGrid.innerHTML = `
        <div class="forecast-error">
            <p>Unable to load forecast</p>
        </div>
    `;
}

// ========================================
// MEMBER SPOTLIGHTS
// ========================================
async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayRandomSpotlights(data.members);
        
    } catch (error) {
        console.error('Error loading spotlights:', error);
        displaySpotlightsError();
    }
}

function displayRandomSpotlights(members) {
    if (!spotlightsList) return;
    
    // Filter only Gold (level 3) and Silver (level 2) members
    const qualifiedMembers = members.filter(member => 
        member.membershipLevel === 2 || member.membershipLevel === 3
    );
    
    if (qualifiedMembers.length === 0) {
        spotlightsList.innerHTML = '<p>No qualified members found</p>';
        return;
    }
    
    // Randomly select 2-3 members
    const numSpotlights = Math.min(3, qualifiedMembers.length);
    const selectedMembers = [];
    const membersCopy = [...qualifiedMembers];
    
    // Fisher-Yates shuffle algorithm to randomly select members
    for (let i = 0; i < numSpotlights; i++) {
        const randomIndex = Math.floor(Math.random() * membersCopy.length);
        selectedMembers.push(membersCopy[randomIndex]);
        membersCopy.splice(randomIndex, 1);
    }
    
    // Clear loading placeholder
    spotlightsList.innerHTML = '';
    
    // Display selected members
    selectedMembers.forEach(member => {
        const spotlightCard = createSpotlightCard(member);
        spotlightsList.appendChild(spotlightCard);
    });
    
    console.log('Loaded spotlights:', selectedMembers.map(m => m.name));
}

function createSpotlightCard(member) {
    const card = document.createElement('article');
    card.className = 'spotlight-card-home';
    
    // Get membership badge
    const badgeClass = member.membershipLevel === 3 ? 'gold' : 'silver';
    const badgeText = member.membershipLevel === 3 ? '⭐ Oro' : '⭐ Plata';
    
    // Extract domain from website for cleaner display
    const websiteDisplay = member.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Generate email from company name
    const emailDomain = member.name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 15);
    const email = `info@${emailDomain}.com`;
    
    card.innerHTML = `
        <div class="spotlight-header-home">
            <h3>${member.name}</h3>
            <span class="spotlight-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="spotlight-image-home">
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
        </div>
        <div class="spotlight-info-home">
            <p><strong>📍</strong> ${member.address}</p>
            <p><strong>📞</strong> <a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
            <p><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${websiteDisplay}</a></p>
        </div>
    `;
    
    return card;
}

function displaySpotlightsError() {
    if (!spotlightsList) return;
    
    spotlightsList.innerHTML = `
        <div class="spotlight-error">
            <p>Unable to load member spotlights</p>
            <p>Please try refreshing the page</p>
        </div>
    `;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
// Log initialization
console.log('🏠 Home page JavaScript loaded');
console.log('📍 Location:', `Lat: ${myLat}, Lon: ${myLong}`);