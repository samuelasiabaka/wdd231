const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const captionDesc = document.querySelector("figcaption");

const url =
  "https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=imperial&appid=4196a896a80eb95936c664081908e695";

async function apiFetch() {
  try {
    response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.error("Error fetching API data:", error);
  }
}
