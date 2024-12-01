var searchInput = document.querySelector("#search");
var searchButton = document.getElementById("btn-search");

async function getWeather(item) {
  try {
    var weather = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=c6cc157f46c94b3896e181151243011&q=${item}&days=3`
    );
    var finalResult = await weather.json();

    console.log(finalResult);
    display(finalResult);
  } catch (error) {
    // حدد عنصرًا صحيحًا باستخدام class أو id لعرض رسالة الخطأ
    document.querySelector(".current-weather").innerHTML = `
        <div class='alert alert-danger'>${error.message}</div>
      `;
  }
}

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    getWeather(`Latitude: ${latitude}, Longitude: ${longitude}`);
  },
  (error) => {
    console.error(`Error (${error.code}): ${error.message}`);
  }
);

// getWeather();
searchButton.addEventListener("click", function () {
  getWeather(searchInput.value);
});

function formatDate(dateString) {
  const date = new Date(dateString);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];

  return `${dayName}, ${day} ${monthName}`;
}

function display(finalResult) {
  var carton = "";

  const formattedDate = formatDate(
    finalResult.current.last_updated.split(" ")[0]
  );

  carton += ` <div class="location-date">
            <div class="location">${finalResult.location.name}</div>
            <div class="date">${formattedDate}</div>
          </div>
          <div class="temperature-icon">
            <div class="weather-icon"><img src="https:${finalResult.current.condition.icon}" alt="Weather Icon">
  </div>
            <div class="temperature">${finalResult.current.temp_c}°C</div>
            <div class="condition">Clouds</div>
          </div>
            <div class="details">
          <div class="detail">💧 Humidity: 74%</div>
          <div class="detail">🌬 Wind Speed: 4.12 M/s</div>
        </div>`;
  document.querySelector(".current-weather").innerHTML = carton;

  var items = "";
  for (let i = 0; i < 3; i++) {
    const forecastDate = formatDate(finalResult.forecast.forecastday[i].date);
    items += `   <div class="forecast-day">
            <div>${forecastDate}</div>
              <div class="weather-icon"><img src="https:${finalResult.forecast.forecastday[i].day.condition.icon}" alt="Weather Icon">
  </div>
            <div>${finalResult.forecast.forecastday[i].day.maxtemp_c}°C</div>
          </div>
          `;
  }
  document.querySelector(".forecast").innerHTML = items;
}
