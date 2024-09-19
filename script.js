const APIKEY = "c71e4b03f3fdf4fa27252f5ffbc50aa6";
const search = document.getElementById("search");
const weatherInfo = document.getElementById("weatherInfo");
const geolocate = document.getElementById("geolocate");
const unitToggle = document.getElementById("unitToggle");
const searchHistory = document.getElementById("historyList");

let unit = "metric"; // Default unit

unitToggle.addEventListener("change", () => {
  unit = unitToggle.value;
});

search.addEventListener("click", async () => {
  const city = document.getElementById("city").value;
  const country = document.getElementById("country").value;
  fetchWeather(city, country);
  addToHistory(city, country);
});

geolocate.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

async function fetchWeather(city, country) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=${unit}&appid=${APIKEY}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (response.ok) {
      displayWeather(data);
    } else {
      weatherInfo.innerHTML = `<p class="text-red-500">Error: ${data.message}</p>`;
    }
  } catch (error) {
    weatherInfo.innerHTML = `<p class="text-red-500">Error: Unable to fetch weather data.</p>`;
  }
}

async function fetchWeatherByCoords(lat, lon) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${APIKEY}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (response.ok) {
      displayWeather(data);
    } else {
      weatherInfo.innerHTML = `<p class="text-red-500">Error: ${data.message}</p>`;
    }
  } catch (error) {
    weatherInfo.innerHTML = `<p class="text-red-500">Error: Unable to fetch weather data.</p>`;
  }
}

function displayWeather(data) {
  const temp = data.main.temp;
  const pressure = data.main.pressure;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const uvIndex = data.uvi || "N/A"; // UV index might not be available in all responses
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  weatherInfo.innerHTML = `
    <p class="mb-2"><strong>Temperature:</strong> ${temp.toFixed(2)} °${
    unit === "metric" ? "C" : "F"
  }</p>
    <p class="mb-2"><strong>Pressure:</strong> ${pressure} hPa</p>
    <p class="mb-2"><strong>Humidity:</strong> ${humidity}%</p>
    <p class="mb-2"><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    <p class="mb-2"><strong>UV Index:</strong> ${uvIndex}</p>
    <p class="mb-2"><strong>Sunrise:</strong> ${sunrise}</p>
    <p class="mb-2"><strong>Sunset:</strong> ${sunset}</p>
  `;
}

function addToHistory(city, country) {
  const listItem = document.createElement("li");
  listItem.textContent = `${city}, ${country}`;
  listItem.classList.add("cursor-pointer", "hover:underline");
  listItem.addEventListener("click", () => {
    fetchWeather(city, country);
  });
  searchHistory.appendChild(listItem);
}
