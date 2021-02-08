const locationinput = document.querySelector("#cityinput");
const locationsubmit = document.querySelector("#submit");
const locationIcon = document.querySelector("#location-logo");

const temp = document.querySelector("#temp");
const tempFeel = document.querySelector("#tempfeel");
const condition = document.querySelector("#condition");
const city = document.querySelector("#city");
const img = document.querySelector("#icon");

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
    
    const data = await request.json();
   
    const obj = await dataFactory(data.main.temp, data.main.feels_like, data.weather[0].description, 
        data.weather[0].icon, data.name);

    return obj;
}

locationsubmit.addEventListener("click", async (e) => {
   
    e.preventDefault()

    const city = locationinput.value;

    const data = await getWeatherData(city);

    updateDOM(data);
})

const updateDOM = (data) => {
    temp.textContent = data.getTempCelsius;
    tempfeel.textContent = data.getTempFeelCelsius;
    condition.textContent = data.condition;
    city.textContent = data.city;
    img.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
}

const userLocationInput = async function () {
    
        async function success(result) {
        const coordinates = result.coords;
        const latitude = coordinates.latitude;
        const longitude = coordinates.longitude;

        const locationRequest = await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=pk.74f454060c7a9f8b245dd7bf24c08d88&lat=${latitude}&lon=${longitude}&format=json`)
        const cityData = await locationRequest.json()
        
        const data = await getWeatherData(cityData.address.city);

        updateDOM(data);

    }
    navigator.geolocation.getCurrentPosition(success)
}

  window.addEventListener('load', userLocationInput);

  locationIcon.addEventListener('click', userLocationInput)