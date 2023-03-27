const weather_api_key = "5e092f0a824d2f0fd1d58aa3e373087f"

const searchBtn = document.getElementById('search-btn');
let city; 


let weatherForecast = `https://api.openweathermap.org/data/2.5/forecast`;

let weather = `https://api.openweathermap.org/data/2.5/weather`;


searchBtn.addEventListener("click", function(){

});

function init(){
    const locations = localStorage.getItem("location");
    let historyHTML = ""
    if(locations != null){
        JSON.parse(locations).forEach(location =>{
            historyHTML += `<li class="list-group-item" onclick="search('${location}')">${location}</li>`;
        })
    }
    document.getElementById("searched-history").innerHTML = historyHTML;
}

async function getWeather(city){
    let URL = `${weather}?q=${city}&limit=1&units=metric&appid=${weather_api_key}`;
    let result = await fetch(URL);
    return await result.json();
}

async function getWeatherForecast(city){
    let URL = `${weatherForecast}?q=${city}&units=metric&appid=${weather_api_key}`
    let result = await fetch(URL);
    return await result.json();
}

async function lookup(event){
    event.preventDefault();
    const city = document.getElementById("search-location").value;
    await search(city)
}

async function search(city){
    const details = await getWeather(city);
    const todayDate = new Date().toLocaleDateString();
    let locations = [];
    if(localStorage.getItem("location") != null){
        locations = JSON.parse(localStorage.getItem("location"));
    }
    if(!locations.includes(details.name)){ 
        locations.push(details.name);
    }
    localStorage.setItem("location", JSON.stringify(locations));
    init();
    const currentWeatherHTML = `
    <div class="h2 card-header" id="current-city-name">
    ${details.name} ${todayDate}
    </div>
    <div class="card-body">
        <p class="current-temp-icon text-center">
        <img src="https://openweathermap.org/img/w/${details.weather[0].icon}.png">
        </p>
        <ul class="list-group list-group-flush overview current-info">
            <li class="current-temp">Temp: ${details.main.temp}</li>
            <li class="current-wind">Wind: ${details.wind.speed}</li>
            <li class="current-humidity">Humidity: ${details.main.humidity}</li>
        </ul>
    </div>`;

    const forecast = await getWeatherForecast(city);
    const date = new Date();
    const getYear = date.toLocaleString("default", { year: "numeric" });
    const getMonth = date.toLocaleString("default", { month: "2-digit" });
    const getDay = date.toLocaleString("default", { day: "2-digit" });
    let dateString = getYear + "-" + getMonth + "-" + getDay;
    const future = forecast.list.filter((hourly) =>{
        const isTrue = (!hourly.dt_txt.includes(dateString))
        dateString = hourly.dt_txt.substring(0, 10)
        return isTrue;
    })
    
    futureWeatherHTML = "";

    future.forEach(eachWeather =>{
        futureWeatherHTML += futureWeatherUI(eachWeather);
    })

    document.getElementById('weekday-focast').innerHTML = futureWeatherHTML;
    document.getElementById('current-weather').innerHTML = currentWeatherHTML;
}

function futureWeatherUI(details){
    const futureWeather = `          
    <div class="week-day">
        <div class="each-card">
            <h4 class="future-date text-center">${details.dt_txt.substring(0, 10)}</h4>
            <div class="text-center">
            <img src="https://openweathermap.org/img/w/${details.weather[0].icon}.png">
            </div>
            <ul class="future-info">
                <li class="future-temp">Temp: ${details.main.temp}</li>
                <li class="future-wind">Wind: ${details.wind.speed}</li>
                <li class="future-humidity">Humidity: ${details.main.humidity}</li>
            </ul>
        </div>
    </div>`;
    return futureWeather;
}

init();