const APIKEY = "c71e4b03f3fdf4fa27252f5ffbc50aa6";
const search = document.getElementById("search");
const weatherInfo = document.getElementById("weatherInfo");

search.addEventListener("click", async () => {
  const city = document.getElementById("city").value;
  const country = document.getElementById("country").value;

  
  const endpoints = [
    `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${APIKEY}`,
    `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${APIKEY}`,
    `https://api.openweathermap.org/data/3.0/weather?q=${city},${country}&appid=${APIKEY}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok) {
        const temp = data.main.temp - 273.15;
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        weatherInfo.innerHTML = `
                <p class="mb-2"><strong>Temperature:</strong> ${temp.toFixed(
                  2
                )} °C</p>
                <p class="mb-2"><strong>Pressure:</strong> ${pressure} hPa</p>
                <p class="mb-2"><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
              `;
        return; 
      } else {
        console.log(
          `Failed with endpoint: ${endpoint}. Error: ${data.message}`
        );
      }
    } catch (error) {
      console.error(`Error with endpoint ${endpoint}:`, error);
    }
  }


  weatherInfo.innerHTML = `<p class="text-red-500">Error: Unable to fetch weather data. Please check your API key and try again later.</p>`;
});
