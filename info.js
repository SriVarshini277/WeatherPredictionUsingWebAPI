document.addEventListener("DOMContentLoaded", function() {
    displayWeatherData();
});

function goBackToHome() {
    window.location.href = 'index.html';
}

function displayWeatherData() {
    try {
        //Get weather data
        var result = sessionStorage.getItem("weatherInfo");
        if (!result) {
            alert("No weather data found. Please search for a city first.");
            window.location.href = 'index.html';
            return;
        }

        var weatherInfo = JSON.parse(result);
        
        //Use the timezone offset from the API response
        const timezoneOffset = weatherInfo.timezone; 
        
        //Handle sunrise and sunset times with proper timezone adjustment
        var sunRise = formatTimeWithTimezone(weatherInfo.sys.sunrise, timezoneOffset);
        var sunSet = formatTimeWithTimezone(weatherInfo.sys.sunset, timezoneOffset);
        
        //Current date and time in the location's timezone
        const locationDate = getLocationDateTime(timezoneOffset);
        
        //Set the weather icon based on weather condition
        setWeatherIcon(weatherInfo.weather[0].main);
        
        //Display city, country, and current date in the location's timezone
        document.getElementsByClassName("city")[0].innerHTML = formatDate(locationDate) + " - " + 
                                                             formatTimeWithTimezone(Math.floor(Date.now() / 1000), timezoneOffset) + " - " +
                                                             weatherInfo.name + ", " + weatherInfo.sys.country;
        
        //Display coordinates with correct directional indicators
        const latDirection = weatherInfo.coord.lat >= 0 ? "°N" : "°S";
        const lonDirection = weatherInfo.coord.lon >= 0 ? "°E" : "°W";
        document.getElementsByClassName("lat")[0].innerHTML = "Latitude: " + Math.abs(weatherInfo.coord.lat) + latDirection;
        document.getElementsByClassName("lon")[0].innerHTML = "Longitude: " + Math.abs(weatherInfo.coord.lon) + lonDirection;
        
        //Display timezone information
        const timezoneHours = Math.floor(timezoneOffset / 3600);
        const timezoneMinutes = Math.floor((timezoneOffset % 3600) / 60);
        const timezoneString = `UTC${timezoneHours >= 0 ? '+' : ''}${timezoneHours}:${String(timezoneMinutes).padStart(2, '0')}`;
        document.getElementsByClassName("timezone")[0].innerHTML = "Timezone: " + timezoneString;
        
        //Display weather information
        document.getElementById("weatherData").textContent = weatherInfo.weather[0].main;
        document.getElementsByClassName("sunrise")[0].innerHTML = "Sunrise: " + sunRise;
        document.getElementsByClassName("sunset")[0].innerHTML = "Sunset: " + sunSet;
        document.getElementsByClassName("desc")[0].innerHTML = "Description: " + 
            weatherInfo.weather[0].description.replace(/\b\w/g, char => char.toUpperCase());
        
        //Display temperature information
        document.getElementById("temp").textContent = "Temperature: " + weatherInfo.main.temp + "°F";
        document.getElementById("maxTemp").textContent = "Temp(Max): " + weatherInfo.main.temp_max + "°F";
        document.getElementById("minTemp").textContent = "Temp(Min): " + weatherInfo.main.temp_min + "°F";
        document.getElementById("humidity").textContent = "Humidity: " + weatherInfo.main.humidity + "%";
        document.getElementById("pressure").textContent = "Pressure: " + weatherInfo.main.pressure + "mb";
        document.getElementById("windSpeed").textContent = "Wind Speed: " + weatherInfo.wind.speed + "mph";
        document.getElementsByClassName("degree")[0].innerHTML = "Wind Degree: " + (weatherInfo.wind.deg || "N/A") + "°";
        
        //Optional fields that might not be present in all API responses
        if (weatherInfo.main.sea_level) {
            document.getElementsByClassName("seaLevel")[0].innerHTML = "Sea Level: " + weatherInfo.main.sea_level + "m";
        } else {
            document.getElementsByClassName("seaLevel")[0].innerHTML = "Sea Level: N/A";
        }
        
        if (weatherInfo.main.feels_like) {
            document.getElementsByClassName("feelsLike")[0].innerHTML = "Feels Like: " + weatherInfo.main.feels_like + "°F";
        } else {
            document.getElementsByClassName("feelsLike")[0].innerHTML = "Feels Like: N/A";
        }
    } catch (error) {
        console.error("Error displaying weather data:", error);
        alert("An error occurred while displaying weather data. Please try again.");
        window.location.href = 'index.html';
    }
}

//Get the date object adjusted for location's timezone
function getLocationDateTime(timezoneOffset) {
    const now = new Date();
    const utcTimestamp = now.getTime() + (now.getTimezoneOffset() * 60000);
    const locationTimestamp = utcTimestamp + (timezoneOffset * 1000);
    return new Date(locationTimestamp);
}

function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
}

//Format time using the timezone offset from the API
function formatTimeWithTimezone(timestamp, timezoneOffset) {
    const utcTime = timestamp * 1000;
    const utcDate = new Date(utcTime);
    const utcHours = utcDate.getUTCHours();
    const utcMinutes = utcDate.getUTCMinutes();
    const localHours = (utcHours + Math.floor(timezoneOffset / 3600)) % 24;
    const localMinutes = (utcMinutes + Math.floor((timezoneOffset % 3600) / 60)) % 60;
    const ampm = localHours >= 12 ? 'PM' : 'AM';
    const hour12 = localHours % 12 || 12;
    return `${hour12}:${localMinutes.toString().padStart(2, '0')} ${ampm}`;
}

function setWeatherIcon(iconCode) {
    switch(iconCode) {
        case "Clear":
            document.getElementById('weatherIcon').src = "./images/sun.gif";
            break;
        case "Clouds":
            document.getElementById('weatherIcon').src = "./images/clouds.gif";
            break;
        case "Tornado":
            document.getElementById('weatherIcon').src = "./images/tornado.png";
            break;
        case "Mist":
            document.getElementById('weatherIcon').src = "./images/mist.png";
            break;
        case "Snow":
            document.getElementById('weatherIcon').src = "./images/snow.gif";
            break;
        case "Thunderstorm":
            document.getElementById('weatherIcon').src = "./images/thunderstorm.gif";
            break;
        case "Rain":
            document.getElementById('weatherIcon').src = "./images/rain.gif";
            break;
        case "Drizzle":
            document.getElementById('weatherIcon').src = "./images/drizzle.gif";
            break;
        default:
            document.getElementById('weatherIcon').src = "./images/mist.png";
    }
}