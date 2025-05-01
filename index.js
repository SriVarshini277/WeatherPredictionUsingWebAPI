document.getElementById("searchButton").addEventListener("click", getWeatherData);
document.getElementById("searchBox").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeatherData();
    }
});

async function getWeatherData() {
    var location = document.getElementById("searchBox").value;

    if (location == "") {
        alert("Provide city name to proceed..");
    } else {
        const url = `https://open-weather13.p.rapidapi.com/city/${location}/EN`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '7f74406a30msh378b2d519587eb3p1319d5jsn98f87ea31715',
                'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json(); // Changed from text() to json()
            console.log(result);
            
            if (result.cod && result.cod !== 200) {
                alert("Error: " + result.message || "City not found");
                return;
            }
            
            sessionStorage.setItem("weatherInfo", JSON.stringify(result));
            window.location.href = "info.html";
        } catch (error) {
            console.error(error);
            alert("An error occurred while fetching weather data. Please try again.");
        }
    }
}