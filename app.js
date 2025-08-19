const apiKey = "5c08a887f729315ff422e81a471ea0c3"; // replace with your API key
const citiesContainer = document.getElementById("citiesContainer");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const unitToggle = document.getElementById("unitToggle");
const themeToggle = document.getElementById("themeToggle");
const refreshBtn = document.getElementById("refreshBtn");
const countryTabs = document.querySelectorAll(".country-tab");
let currentUnit = "metric"; 
let currentFilter = "all"; 
let failedCities = []; 
let weatherCache = {}; 
let forecastCache = {};
let isSearchMode = false; 

// Cities data with correct API names and display names
const cities = [
  // Afghanistan
  { name: "Kabul", country: "AFG", countryName: "Afghanistan" },
  { name: "Herat", country: "AFG", countryName: "Afghanistan" },
  { name: "Kunar", country: "AFG", countryName: "Afghanistan" },
  { name: "Nangarhar", country: "AFG", countryName: "Afghanistan" },
  // Pakistan
  { name: "Peshawar", country: "PK", countryName: "Pakistan" },
  { name: "Karachi", country: "PK", countryName: "Pakistan" },
  { name: "Lahore", country: "PK", countryName: "Pakistan" },
  { name: "Islamabad", country: "PK", countryName: "Pakistan" },
  // India
  { name: "Mumbai", country: "IN", countryName: "India" },
  { name: "Delhi", country: "IN", countryName: "India" },
  { name: "Bangalore", country: "IN", countryName: "India" },
  { name: "Kolkata", country: "IN", countryName: "India" },
  // Saudi Arabia - Updated with correct API names
  { name: "Riyadh", country: "SA", countryName: "Saudi Arabia" },
  { name: "Makkah", country: "SA", countryName: "Saudi Arabia" },
  { name: "Medina", country: "SA", countryName: "Saudi Arabia" },
  { name: "Jeddah", country: "SA", countryName: "Saudi Arabia" },
  // Afghanistan (additional cities)
  { name: "Badakhshan", country: "AFG", countryName: "Afghanistan" },
  { name: "Badghis", country: "AFG", countryName: "Afghanistan" },
  { name: "Baghlan", country: "AFG", countryName: "Afghanistan" },
  { name: "Balkh", country: "AFG", countryName: "Afghanistan" },
  { name: "Bamyan", country: "AFG", countryName: "Afghanistan" },
  { name: "Daykundi", country: "AFG", countryName: "Afghanistan" },
  { name: "Farah", country: "AFG", countryName: "Afghanistan" },
  { name: "Faryab", country: "AFG", countryName: "Afghanistan" },
  { name: "Ghazni", country: "AFG", countryName: "Afghanistan" },
  { name: "Ghor", country: "AFG", countryName: "Afghanistan" },
  { name: "Helmand", country: "AFG", countryName: "Afghanistan" },
  { name: "Jowzjan", country: "AFG", countryName: "Afghanistan" },
  { name: "Kandahar", country: "AF", countryName: "Afghanistan" },
  { name: "Kapisa", country: "AFG", countryName: "Afghanistan" },
  { name: "Khost", country: "AFG", countryName: "Afghanistan" },
  { name: "Kunduz", country: "AFG", countryName: "Afghanistan" },
  { name: "Laghman", country: "AFG", countryName: "Afghanistan" },
  { name: "Logar", country: "AFG", countryName: "Afghanistan" },
  { name: "Nimruz", country: "AFG", countryName: "Afghanistan" },
  { name: "Nuristan", country: "AFG", countryName: "Afghanistan" },
  { name: "Paktia", country: "AFG", countryName: "Afghanistan" },
  { name: "Paktika", country: "AFG", countryName: "Afghanistan" },
  { name: "Panjshir", country: "AFG", countryName: "Afghanistan" },
  { name: "Parwan", country: "AFG", countryName: "Afghanistan" },
  { name: "Samangan", country: "AFG", countryName: "Afghanistan" },
  { name: "Sar-e Pol", country: "AFG", countryName: "Afghanistan" },
  { name: "Takhar", country: "AFG", countryName: "Afghanistan" },
  { name: "Uruzgan", country: "AFG", countryName: "Afghanistan" },
  { name: "Wardak", country: "AFG", countryName: "Afghanistan" },
  { name: "Zabul", country: "AFG", countryName: "Afghanistan" },
  // Pakistan (additional cities)
  { name: "Swabi", country: "PK", countryName: "Pakistan" },
  { name: "Multan", country: "PK", countryName: "Pakistan" },
  { name: "Faisalabad", country: "PK", countryName: "Pakistan" },
  { name: "Rawalpindi", country: "PK", countryName: "Pakistan" },
  { name: "Hyderabad", country: "PK", countryName: "Pakistan" },
  { name: "Sialkot", country: "PK", countryName: "Pakistan" },
  { name: "Gujranwala", country: "PK", countryName: "Pakistan" },
  { name: "Bahawalpur", country: "PK", countryName: "Pakistan" },
  { name: "Mardan", country: "PK", countryName: "Pakistan" },
  { name: "Abbottabad", country: "PK", countryName: "Pakistan" },
  { name: "Chitral", country: "PK", countryName: "Pakistan" },
  { name: "Gilgit", country: "PK", countryName: "Pakistan" },
  // India (additional cities)
  { name: "Chennai", country: "IN", countryName: "India" },
  { name: "Hyderabad", country: "IN", countryName: "India" },
  { name: "Pune", country: "IN", countryName: "India" },
  { name: "Ahmedabad", country: "IN", countryName: "India" },
  { name: "Jaipur", country: "IN", countryName: "India" },
  { name: "Lucknow", country: "IN", countryName: "India" },
  { name: "Kanpur", country: "IN", countryName: "India" },
  { name: "Nagpur", country: "IN", countryName: "India" },
  { name: "Surat", country: "IN", countryName: "India" },
  { name: "Indore", country: "IN", countryName: "India" },
  { name: "Patna", country: "IN", countryName: "India" },
  { name: "Bhopal", country: "IN", countryName: "India" },
  // Saudi Arabia (additional cities)
  { name: "Dammam", country: "SA", countryName: "Saudi Arabia" },
  { name: "Khobar", country: "SA", countryName: "Saudi Arabia" },
  { name: "Jubail", country: "SA", countryName: "Saudi Arabia" },
  { name: "Tabuk", country: "SA", countryName: "Saudi Arabia" },
  { name: "Abha", country: "SA", countryName: "Saudi Arabia" },
  { name: "Hail", country: "SA", countryName: "Saudi Arabia" },
  { name: "Najran", country: "SA", countryName: "Saudi Arabia" },
  { name: "Yanbu", country: "SA", countryName: "Saudi Arabia" },
  { name: "Al Bahah", country: "SA", countryName: "Saudi Arabia" },
  { name: "Taif", country: "SA", countryName: "Saudi Arabia" },
  { name: "Qassim", country: "SA", countryName: "Saudi Arabia" },
  { name: "Al Jubail", country: "SA", countryName: "Saudi Arabia" },
];

// Load theme preference from localStorage (default to light mode)
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
  themeToggle.textContent = "🌞 Toggle Mode";
} else {
  // Default to light mode
  document.documentElement.classList.remove("dark");
  themeToggle.textContent = "🌙 Toggle Mode";
}

// Add this function to detect theme mode and apply appropriate classes
function updateThemeClasses() {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
  }
}

// Show loading indicator with progress
function showLoading() {
  citiesContainer.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
      <p class="text-white/80">Loading weather data...</p>
      <div class="w-64 bg-gray-200 rounded-full h-2.5 mt-4 dark:bg-gray-700">
        <div class="bg-blue-600 h-2.5 rounded-full progress-bar" style="width: 0%"></div>
      </div>
    </div>
  `;

  // Animate progress bar
  const progressBar = document.querySelector(".progress-bar");
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 90) {
      clearInterval(interval);
    } else {
      width += 5;
      progressBar.style.width = width + "%";
    }
  }, 200);
}

// Get the correct city name for API (use apiName if available, otherwise use name)
function getApiName(city) {
  return city.apiName || city.name;
}

// Fetch current weather for a city with caching
async function fetchWeatherData(city) {
  const cacheKey = `${city.name}-${city.country}-${currentUnit}`;

  // Check if data is already cached
  if (
    weatherCache[cacheKey] &&
    !isDataExpired(weatherCache[cacheKey].timestamp)
  ) {
    return weatherCache[cacheKey].data;
  }

  const apiName = getApiName(city);

  // Try with country code first
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${apiName},${city.country}&appid=${apiKey}&units=${currentUnit}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // Cache the data with timestamp
      weatherCache[cacheKey] = {
        data: data,
        timestamp: Date.now(),
      };
      return data;
    }
  } catch (error) {
    console.log(`First attempt failed for ${city.name}:`, error);
  }

  // Fallback: try without country code
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${apiName}&appid=${apiKey}&units=${currentUnit}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // Cache the data with timestamp
      weatherCache[cacheKey] = {
        data: data,
        timestamp: Date.now(),
      };
      return data;
    }
  } catch (error) {
    console.log(`Second attempt failed for ${city.name}:`, error);
  }

  // If both attempts fail, throw error
  throw new Error(`City not found: ${city.name}`);
}

// Fetch 5-day forecast for a city with caching
async function fetchForecastData(city) {
  const cacheKey = `${city.name}-${city.country}-${currentUnit}-forecast`;

  // Check if data is already cached
  if (
    forecastCache[cacheKey] &&
    !isDataExpired(forecastCache[cacheKey].timestamp)
  ) {
    return forecastCache[cacheKey].data;
  }

  const apiName = getApiName(city);

  // Try with country code first
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${apiName},${city.country}&appid=${apiKey}&units=${currentUnit}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      forecastCache[cacheKey] = {
        data: data,
        timestamp: Date.now(),
      };
      return data;
    }
  } catch (error) {
    console.log(`First forecast attempt failed for ${city.name}:`, error);
  }

  // Fallback: try without country code
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${apiName}&appid=${apiKey}&units=${currentUnit}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // Cache the data with timestamp
      forecastCache[cacheKey] = {
        data: data,
        timestamp: Date.now(),
      };
      return data;
    }
  } catch (error) {
    console.log(`Second forecast attempt failed for ${city.name}:`, error);
  }

  // If both attempts fail, throw error
  throw new Error(`Forecast not found for: ${city.name}`);
}

// Check if cached data is expired (10 minutes)
function isDataExpired(timestamp) {
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;
  return now - timestamp > tenMinutes;
}

// Create a city weather card
function createCityCard(cityData, forecastData, originalCity) {
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const iconUrl = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`;

  // Process forecast data to get daily forecasts
  const dailyForecasts = {};
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt_txt).toLocaleDateString("en-US");
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(item);
  });

  // Get the midday forecast for each day
  const dailyData = Object.keys(dailyForecasts).map((date) => {
    const dayData = dailyForecasts[date];
    const middayForecast = dayData.reduce((prev, curr) => {
      const prevHour = new Date(prev.dt_txt).getHours();
      const currHour = new Date(curr.dt_txt).getHours();
      return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
    });

    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      ...middayForecast,
    };
  });

  // Ensure we have 7 days of forecast (including Sunday)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const fullWeekForecast = [];

  // Start from today and get the next 7 days
  for (let i = 0; i < 7; i++) {
    const dayIndex = (today + i) % 7;
    const dayName = weekDays[dayIndex];

    // Find if we have forecast data for this day
    const dayForecast = dailyData.find((day) => day.date === dayName);

    if (dayForecast) {
      fullWeekForecast.push(dayForecast);
    } else {
      const lastAvailable = dailyData[dailyData.length - 1];
      if (lastAvailable) {
        fullWeekForecast.push({
          ...lastAvailable,
          date: dayName,
        });
      } else {
        // If no forecast data at all, create a placeholder
        fullWeekForecast.push({
          date: dayName,
          main: { temp: 20 },
          weather: [{ icon: "01d" }],
        });
      }
    }
  }

  // Create the city card
  const cityCard = document.createElement("div");
  cityCard.className =
    "glass rounded-lg p-4 shadow-md animate-fadeIn hover-lift";

  cityCard.innerHTML = `
    <div class="text-center">
      <h3 class="text-lg font-bold">${originalCity.name}, ${
    cityData.sys.country
  }</h3>
      <div class="flex items-center justify-center my-2">
        <img src="${iconUrl}" alt="${
    cityData.weather[0].description
  }" class="w-12 h-12">
        <p class="text-sm capitalize ml-2">${
          cityData.weather[0].description
        }</p>
      </div>
      <p class="text-2xl font-bold">${Math.round(
        cityData.main.temp
      )}${unitSymbol}</p>
      <p class="text-sm">Humidity: ${cityData.main.humidity}% | Wind: ${
    cityData.wind.speed
  } ${currentUnit === "metric" ? "m/s" : "mph"}</p>
      
      <div class="mt-3">
        <h4 class="font-semibold mb-1">7-Day Forecast</h4>
        <div class="weekly-forecast">
          ${fullWeekForecast
            .map(
              (day) => `
            <div class="day">
              <p class="day-name">${day.date}</p>
              <img src="https://openweathermap.org/img/wn/${
                day.weather[0].icon
              }.png" class="day-icon" alt="icon"/>
              <p class="day-temp">${Math.round(day.main.temp)}${unitSymbol}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  return cityCard;
}

// Create a card for a city not in our featured list (with full 7-day forecast)
function createDirectCityCard(cityData, forecastData) {
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const iconUrl = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`;

  // Process forecast data to get daily forecasts
  const dailyForecasts = {};
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt_txt).toLocaleDateString("en-US");
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(item);
  });

  // Get the midday forecast for each day
  const dailyData = Object.keys(dailyForecasts).map((date) => {
    const dayData = dailyForecasts[date];
    const middayForecast = dayData.reduce((prev, curr) => {
      const prevHour = new Date(prev.dt_txt).getHours();
      const currHour = new Date(curr.dt_txt).getHours();
      return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
    });

    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      ...middayForecast,
    };
  });

  // Ensure we have 7 days of forecast (including Sunday)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const fullWeekForecast = [];

  // Start from today and get the next 7 days
  for (let i = 0; i < 7; i++) {
    const dayIndex = (today + i) % 7;
    const dayName = weekDays[dayIndex];

    // Find if we have forecast data for this day
    const dayForecast = dailyData.find((day) => day.date === dayName);

    if (dayForecast) {
      fullWeekForecast.push(dayForecast);
    } else {
      const lastAvailable = dailyData[dailyData.length - 1];
      if (lastAvailable) {
        fullWeekForecast.push({
          ...lastAvailable,
          date: dayName,
        });
      } else {
        // If no forecast data at all, create a placeholder
        fullWeekForecast.push({
          date: dayName,
          main: { temp: 20 },
          weather: [{ icon: "01d" }],
        });
      }
    }
  }

  // Create the city card
  const cityCard = document.createElement("div");
  cityCard.className =
    "col-span-full glass rounded-lg p-6 shadow-md animate-fadeIn search-result-card";

  cityCard.innerHTML = `
    <div class="text-center">
      <h3 class="text-2xl font-bold">${cityData.name}, ${
    cityData.sys.country
  }</h3>
      <div class="flex items-center justify-center my-4">
        <img src="${iconUrl}" alt="${
    cityData.weather[0].description
  }" class="w-16 h-16">
        <p class="text-lg capitalize ml-3">${
          cityData.weather[0].description
        }</p>
      </div>
      <p class="text-3xl font-bold">${Math.round(
        cityData.main.temp
      )}${unitSymbol}</p>
      <p class="mt-2">Humidity: ${cityData.main.humidity}% | Wind: ${
    cityData.wind.speed
  } ${currentUnit === "metric" ? "m/s" : "mph"}</p>
      
      <div class="mt-6">
        <h4 class="text-xl font-semibold mb-3">7-Day Forecast</h4>
        <div class="weekly-forecast">
          ${fullWeekForecast
            .map(
              (day) => `
            <div class="day">
              <p class="day-name">${day.date}</p>
              <img src="https://openweathermap.org/img/wn/${
                day.weather[0].icon
              }.png" class="day-icon" alt="icon"/>
              <p class="day-temp">${Math.round(day.main.temp)}${unitSymbol}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="mt-6 flex justify-center gap-4">
        <button id="backToFeatured" class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors">
          ← Back to Featured Cities
        </button>
        <button id="refreshDirect" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
          🔄 Refresh
        </button>
      </div>
    </div>
  `;

  // Add event listeners to the buttons
  cityCard.querySelector("#backToFeatured").addEventListener("click", () => {
    isSearchMode = false;
    currentFilter = "all";
    updateActiveTab();
    fetchAllCitiesWeather();
  });

  cityCard.querySelector("#refreshDirect").addEventListener("click", () => {
    fetchDirectCityWeather(cityInput.value.trim());
  });

  return cityCard;
}

// Fetch and display weather for all cities with batch processing
async function fetchAllCitiesWeather() {
  showLoading();
  failedCities = []; 
  isSearchMode = false; 

  try {
    // Filter cities based on current filter
    const filteredCities =
      currentFilter === "all"
        ? cities
        : cities.filter((city) => city.country === currentFilter);

    // Create an array to hold successful results
    const successfulResults = [];

    // Process cities in batches to avoid overwhelming the API
    const batchSize = 5; 
    const batches = [];

    // Create batches of cities
    for (let i = 0; i < filteredCities.length; i += batchSize) {
      batches.push(filteredCities.slice(i, i + batchSize));
    }

    // Process each batch
    for (const batch of batches) {
      const batchPromises = batch.map(async (city) => {
        try {
          const weatherData = await fetchWeatherData(city);
          const forecastData = await fetchForecastData(city);
          return {
            weatherData,
            forecastData,
            originalCity: city,
          };
        } catch (error) {
          console.error(`Error fetching data for ${city.name}:`, error);
          failedCities.push(city);
          return null;
        }
      });

      // Wait for all promises in the batch to resolve
      const batchResults = await Promise.all(batchPromises);

      // Add successful results to our array
      batchResults.forEach((result) => {
        if (result) {
          successfulResults.push(result);
        }
      });

      // Update progress bar
      const progress = Math.min(
        90,
        (successfulResults.length / filteredCities.length) * 100
      );
      const progressBar = document.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.width = progress + "%";
      }

      // Small delay between batches to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Clear container
    citiesContainer.innerHTML = "";

    if (successfulResults.length === 0) {
      citiesContainer.innerHTML = `<div class="col-span-full text-center py-12 text-red-400">❌ Unable to fetch weather data for any cities</div>`;
      return;
    }

    // Create and append city cards for successful results
    successfulResults.forEach((result) => {
      const cityCard = createCityCard(
        result.weatherData,
        result.forecastData,
        result.originalCity
      );
      citiesContainer.appendChild(cityCard);
    });

    // If some cities failed, show which ones failed (more informative)
    if (failedCities.length > 0) {
      const failedCityNames = failedCities.map((city) => city.name);

      const errorContainer = document.createElement("div");
      errorContainer.className = "col-span-full mt-4";

      errorContainer.innerHTML = `
        <div class="glass rounded-lg p-4 text-center">
          <p class="text-yellow-300 mb-2">
            ⚠️ Weather data unavailable for: <strong>${failedCityNames.join(
              ", "
            )}</strong>
          </p>
          <p class="text-white/80 text-sm mb-3">
            This could be due to temporary network issues or API limitations. You can try again later.
          </p>
          <button id="retryFailed" class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors">
            🔄 Retry Failed Cities
          </button>
        </div>
      `;

      citiesContainer.appendChild(errorContainer);

      // Add event listener to retry button
      document
        .getElementById("retryFailed")
        .addEventListener("click", retryFailedCities);
    }
  } catch (error) {
    console.error("Error in fetchAllCitiesWeather:", error);
    citiesContainer.innerHTML = `<div class="col-span-full text-center py-12 text-red-400">❌ ${error.message}</div>`;
  }
}

// Retry fetching weather for failed cities
async function retryFailedCities() {
  if (failedCities.length === 0) return;

  showLoading();

  try {
    // Create an array to hold successful results
    const successfulResults = [];
    const newFailedCities = [];

    // Process failed cities in batches
    const batchSize = 3; // Smaller batch size for retries
    const batches = [];

    // Create batches of cities
    for (let i = 0; i < failedCities.length; i += batchSize) {
      batches.push(failedCities.slice(i, i + batchSize));
    }

    // Process each batch
    for (const batch of batches) {
      const batchPromises = batch.map(async (city) => {
        try {
          const weatherData = await fetchWeatherData(city);
          const forecastData = await fetchForecastData(city);
          return {
            weatherData,
            forecastData,
            originalCity: city,
          };
        } catch (error) {
          console.error(`Error retrying data for ${city.name}:`, error);
          newFailedCities.push(city);
          return null;
        }
      });

      // Wait for all promises in the batch to resolve
      const batchResults = await Promise.all(batchPromises);

      // Add successful results to our array
      batchResults.forEach((result) => {
        if (result) {
          successfulResults.push(result);
        }
      });

      // Small delay between batches
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Get existing city cards
    const existingCards = Array.from(citiesContainer.children).filter(
      (child) =>
        !child.classList.contains("animate-spin") &&
        !child.querySelector("#retryFailed")
    );

    // Clear container but keep existing cards
    citiesContainer.innerHTML = "";
    existingCards.forEach((card) => citiesContainer.appendChild(card));

    // Add new successful cards
    successfulResults.forEach((result) => {
      const cityCard = createCityCard(
        result.weatherData,
        result.forecastData,
        result.originalCity
      );
      citiesContainer.appendChild(cityCard);
    });

    // Update failed cities list
    failedCities = newFailedCities;

    // If some cities still failed, show updated error message
    if (failedCities.length > 0) {
      const failedCityNames = failedCities.map((city) => city.name);

      const errorContainer = document.createElement("div");
      errorContainer.className = "col-span-full mt-4";

      errorContainer.innerHTML = `
        <div class="glass rounded-lg p-4 text-center">
          <p class="text-yellow-300 mb-2">
            ⚠️ Still unable to fetch data for: <strong>${failedCityNames.join(
              ", "
            )}</strong>
          </p>
          <p class="text-white/80 text-sm mb-3">
            These cities may be temporarily unavailable. Please try again later.
          </p>
          <button id="retryFailed" class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors">
            🔄 Retry Again
          </button>
        </div>
      `;

      citiesContainer.appendChild(errorContainer);

      // Add event listener to retry button
      document
        .getElementById("retryFailed")
        .addEventListener("click", retryFailedCities);
    }
  } catch (error) {
    console.error("Error in retryFailedCities:", error);
    citiesContainer.innerHTML = `<div class="col-span-full text-center py-12 text-red-400">❌ ${error.message}</div>`;
  }
}

// Event listener for search
searchBtn.addEventListener("click", () => {
  const searchTerm = cityInput.value.trim().toLowerCase();
  if (searchTerm) {
    // Try to find the city in our database
    const foundCity = cities.find(
      (c) =>
        c.name.toLowerCase() === searchTerm ||
        (c.apiName && c.apiName.toLowerCase() === searchTerm) ||
        `${c.name}, ${c.country}`.toLowerCase() === searchTerm ||
        `${c.name}, ${c.countryName}`.toLowerCase() === searchTerm
    );

    if (foundCity) {
      // Set search mode to true and fetch only the searched city
      isSearchMode = true;
      fetchSingleCityWeather(foundCity);
    } else {
      // Try to fetch weather for any city using the API directly
      fetchDirectCityWeather(searchTerm);
    }
  }
});

// Fetch weather for a single city (for search functionality)
async function fetchSingleCityWeather(city) {
  showLoading();

  try {
    const weatherData = await fetchWeatherData(city);
    const forecastData = await fetchForecastData(city);

    // Clear container
    citiesContainer.innerHTML = "";

    // Create and display the city card
    const cityCard = createCityCard(weatherData, forecastData, city);
    cityCard.classList.add("search-result-card"); 
    citiesContainer.appendChild(cityCard);
  } catch (error) {
    console.error("Error in fetchSingleCityWeather:", error);
    citiesContainer.innerHTML = `<div class="col-span-full text-center py-12 text-red-400">❌ ${error.message}</div>`;
  }
}

// Fetch weather for a city not in our database (with full forecast)
async function fetchDirectCityWeather(cityName) {
  showLoading();

  try {
    // Fetch current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${currentUnit}`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) throw new Error("City not found");

    const weatherData = await weatherResponse.json();

    // Fetch forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${currentUnit}`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) throw new Error("Forecast not found");

    const forecastData = await forecastResponse.json();

    // Set search mode to true
    isSearchMode = true;

    // Create and display the city card with full forecast
    citiesContainer.innerHTML = "";
    const cityCard = createDirectCityCard(weatherData, forecastData);
    citiesContainer.appendChild(cityCard);
  } catch (error) {
    citiesContainer.innerHTML = `<div class="col-span-full text-center py-12 text-red-400">❌ ${error.message}</div>`;
  }
}

// Allow search with Enter key
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Refresh button
refreshBtn.addEventListener("click", () => {
  weatherCache = {};
  forecastCache = {};
  if (isSearchMode) {
    const searchTerm = cityInput.value.trim();
    if (searchTerm) {
      fetchDirectCityWeather(searchTerm);
    } else {
      fetchAllCitiesWeather();
    }
  } else {
    fetchAllCitiesWeather();
  }
});

// Unit toggle
unitToggle.addEventListener("click", () => {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  unitToggle.textContent =
    currentUnit === "metric" ? "Switch to °F" : "Switch to °C";
  weatherCache = {};
  forecastCache = {};

  const directCityCard = document.querySelector("#backToFeatured");
  if (directCityCard) {
    fetchDirectCityWeather(cityInput.value.trim());
  } else {
    fetchAllCitiesWeather();
  }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  themeToggle.textContent = isDark ? "🌞 Toggle Mode" : "🌙 Toggle Mode";

  localStorage.setItem("theme", isDark ? "dark" : "light");

  updateThemeClasses();
});

countryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    isSearchMode = false; 
    currentFilter = tab.dataset.country;
    updateActiveTab();
    fetchAllCitiesWeather();
  });
});

function updateActiveTab() {
  countryTabs.forEach((tab) => {
    if (tab.dataset.country === currentFilter) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

// Load weather on startup
window.addEventListener("load", () => {
  updateActiveTab();
  updateThemeClasses();
  fetchAllCitiesWeather();
});
