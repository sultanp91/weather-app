// DOM Elements
const locationinput = document.querySelector("#cityinput");
const locationsubmit = document.querySelector("#submit");
const locationIcon = document.querySelector("#location-logo");
const toggleButton = document.querySelector('#toggle');

const temp = document.querySelector("#temp");
const tempFeel = document.querySelector("#tempfeel");
const condition = document.querySelector("#condition");
const city = document.querySelector("#city");
const img = document.querySelector("#icon");

// Object which will contain weather data to be rendered onto the DOM

let weatherData = {};
let displayCelsius = true;
let displayFahrenheit = false;

// Factory function to create objects with selected weather data

const dataFactory = (temp, tempfeel, condition, icon, city) => {
    
    const getTempCelsius = Math.round(temp);

    const getTempFeelCelsius = Math.round(tempfeel);

    const getTempFahrenheit = Math.round((temp * 1.8) + 32);

    const getTempFeelFahrenheit = Math.round((tempfeel * 1.8) + 32);

    return { getTempCelsius, getTempFeelCelsius, getTempFahrenheit, getTempFeelFahrenheit, condition, icon, city }
}

async function getWeatherData (city) {

    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d814b06e7180432ffac829ff0f153fb9`, { mode: "cors" })
    
    weatherDataRequest = await request.json();
   
    console.log(weatherData)
    
    weatherData = await dataFactory(weatherDataRequest.main.temp, weatherDataRequest.main.feels_like, weatherDataRequest.weather[0].main, 
        weatherDataRequest.weather[0].icon, weatherDataRequest.name);

}

locationsubmit.addEventListener("click", async (e) => {
   
    e.preventDefault()

    const city = locationinput.value;

    await getWeatherData(city);

    updateDom();
})

const updateDomCelsius = () => {
    temp.textContent = `${weatherData.getTempCelsius}  \u00B0C`;
    tempfeel.textContent = `${weatherData.getTempFeelCelsius} \u00B0C`;
    condition.textContent = weatherData.condition;
    city.textContent = weatherData.city;
    img.src = `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
}

const updateDomFahrenheit = () => {
    temp.textContent = `${weatherData.getTempFahrenheit}  \u00B0F`;
    tempfeel.textContent = `${weatherData.getTempFeelFahrenheit} \u00B0F`;
    condition.textContent = weatherData.condition;
    city.textContent = weatherData.city;
    img.src = `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
}

const updateDom = () => {
    if (displayCelsius === true) {
        updateDomCelsius();
    } else if (displayFahrenheit === true){
        updateDomFahrenheit();
    }
}

const toggleUnits = () => {
    if(displayCelsius === true) {
        displayCelsius = false;
        displayFahrenheit = true;
        updateDom()
    } 
    else if(displayFahrenheit === true){
        displayFahrenheit = false;
        displayCelsius = true;
        updateDom()
    }
}

const userLocationInput = async function () {
    
        async function success(result) {
        const coordinates = result.coords;
        const latitude = coordinates.latitude;
        const longitude = coordinates.longitude;

        const locationRequest = await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=pk.74f454060c7a9f8b245dd7bf24c08d88&lat=${latitude}&lon=${longitude}&format=json`)
        const cityData = await locationRequest.json()
        
        await getWeatherData(cityData.address.city);

        updateDom();

    }
    navigator.geolocation.getCurrentPosition(success)
}

  window.addEventListener('load', userLocationInput);

  locationIcon.addEventListener('click', userLocationInput)

  toggleButton.addEventListener("click", (e) => {
        e.preventDefault()

        toggleUnits();
  });