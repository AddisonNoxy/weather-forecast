var searchHistory = document.getElementById('search-history');
var submitBtn = document.getElementById('submit-button');
var cityInfo = document.getElementById('cityinfo');
var currentWeather = document.getElementById('currentweather');
var weatherForecast = document.getElementById('weatherforecast');

var currentTemp = document.getElementById('currentTemp');
var currentWind = document.getElementById('currentWind');
var currentHumid = document.getElementById('currentHumid');

var cityHistory = localStorage.getItem("cityWeatherHistory");

if (!cityHistory) {
    cityHistory = [];
} else {
    cityHistory = cityHistory.split(",");
    
    for (var i = 0; i < cityHistory.length -1; i++) {


        var newButton = document.createElement("button");
        newButton.id = cityHistory[i];
        newButton.textContent = cityHistory[i];
        newButton.className = "px-2 border-black border-solid border-2 rounded bg-blue-300 ";
        var saveCity = newButton.id;
        searchHistory.appendChild(newButton);
    }

    searchHistory.addEventListener('click', (e) => { //add a wrapper listener to all buttons in the search history
        const isButton = e.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }
        console.log("BUTTON CLICKED! " + e.target.id);
        document.getElementById('citynamefield').value = e.target.id;
        getCity();
    })
}

function getCity() {
    var historyNodes = document.querySelector(".history-class"); //find the divs that show the forecast
    while (historyNodes) {
        historyNodes.remove();
        historyNodes = document.querySelector(".history-class");
    }

    var cityName = document.getElementById('citynamefield').value;
    var coords = {};
    var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",US&appid=fa580f314369e2c9d603e57405e54a92";

    fetch(geoURL) //find the city information based on lon and lat
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            coords.lat = data[0].lat;
            coords.lon = data[0].lon

            var cityURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=fa580f314369e2c9d603e57405e54a92&units=imperial`;
            fetch(cityURL)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {

                    var newTable = document.createElement("table");
                    var tableRow = document.createElement('tr');
                    var tableData = document.createElement('td');
                    
                    

                    currentTemp.textContent = "Temperature: " + data.list[0].main.temp + " Fahrenheit";
                    currentWind.textContent = "Wind: " + data.list[0].wind.speed + "MPH";
                    currentHumid.textContent = "Humidity: " + data.list[0].main.humidity + "%";

                    cityInfo.textContent = cityName + " " + data.list[0].dt_txt;
                    
                    var currentTimestamp = data.list[0].dt_txt.split(" ");

                    for (var i = 0; i < data.list.length; i++) { //go through the weather data by date
                        let dateData = data.list[i].dt_txt.split(" ");
                        
                        if (dateData[0] == currentTimestamp[0]) { //if it's the same day as previously, continue on
                            continue;
                        } else { //note down the data
                            currentTimestamp = data.list[i].dt_txt.split(" ");

                            var dayTemp = document.createTextNode(data.list[i].main.temp + " Fahrenheit");
                            var dayWind = document.createTextNode(data.list[i].wind.speed + "MPH");
                            var dayHumid = document.createTextNode(data.list[i].main.humidity + "%");
                            var dateStamp = document.createTextNode(dateData[0]);
                            var newDiv = document.createElement('div');
                            newDiv.className = "history-class";

                            var para1 = document.createElement("p");
                            var para2 = document.createElement("p");
                            var para3 = document.createElement("p");
                            var para4 = document.createElement("p");

                            para1.appendChild(dateStamp);
                            para2.appendChild(dayTemp);
                            para3.appendChild(dayWind);
                            para4.appendChild(dayHumid);
                            newDiv.appendChild(para1);
                            newDiv.appendChild(para2);
                            newDiv.appendChild(para3);
                            newDiv.appendChild(para4);


                            weatherForecast.appendChild(newDiv);
                        }
                        
                    }

                })
        })

    
    for (i = 0; i < cityHistory.length; i++) {
        if (cityName == cityHistory[i]) {
            return;
        }
    }

    cityHistory.push(cityName);
    localStorage.setItem("cityWeatherHistory", cityHistory);
    
    document.getElementById('citynamefield').value = "";

}

submitBtn.addEventListener('click', getCity);