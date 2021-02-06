const locationinput = document.querySelector("#cityinput");
const locationsubmit = document.querySelector("#submit");

const temp = document.querySelector("#temp");
const tempFeel = document.querySelector("#tempfeel");
const condition = document.querySelector("#condition");
const city = document.querySelector("#city");
const img = document.querySelector("#icon");

// Factory function to create objects with selected weather data

const dataFactory = (temp, tempfeel, condition, icon, city) => {
    
    return { temp, tempfeel, condition, icon, city }
}

async function getWeatherData (city) {

    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d814b06e7180432ffac829ff0f153fb9`, { mode: "cors" })
    
    const data = await request.json();
   
    const obj = await dataFactory(data.main.temp, data.main.feels_like, data.weather[0].description, 
        data.weather[0].icon, data.name);

    return obj;
}

locationsubmit.addEventListener("click", async () => {
   
    let city = locationinput.value;

    let data = await getWeatherData(city);

    updateDOM(data);
})

const updateDOM = (data) => {
    temp.textContent = data.temp;
    tempfeel.textContent = data.tempfeel;
    condition.textContent = data.condition;
    city.textContent = data.city;
    img.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
}