var searchHistory = document.getElementById('search-history');
var submitBtn = document.getElementById('submit-button');
var cityInfo = document.getElementById('cityinfo');
var currentWeather = document.getElementById('currentweather');
var weatherForecast = document.getElementById('weatherforecast');

var currentTemp = document.getElementById('currentTemp');
var currentWind = document.getElementById('currentWind');
var currentHumid = document.getElementById('currentHumid');

var cityHistory = localStorage.getItem("cityWeatherHistory");
console.log(cityHistory);

if (!cityHistory) {
    cityHistory = [];
} else {
    cityHistory = cityHistory.split(",");
    console.log(cityHistory);

    
    
    for (var i = 0; i < cityHistory.length; i++) {
        var newRow = document.createElement("tr");
        var newData = document.createElement("td");
        newData.textContent = cityHistory[i];
        newRow.appendChild(newData);
        searchHistory.appendChild(newRow);
    }
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
    console.log("City searched: " + cityName);

    fetch(geoURL) //find the city information based on lon and lat
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            coords.lat = data[0].lat;
            coords.lon = data[0].lon
            console.log(coords);

            var cityURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=fa580f314369e2c9d603e57405e54a92&units=imperial`;
            fetch(cityURL)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    console.log(data);

                    var newTable = document.createElement("table");
                    var tableRow = document.createElement('tr');
                    var tableData = document.createElement('td');
                    
                    
                    console.log(data.list[0].main);

                    currentTemp.textContent = "Temperature: " + data.list[0].main.temp + " Fahrenheit";
                    currentWind.textContent = "Wind: " + data.list[0].wind.speed + "MPH";
                    currentHumid.textContent = "Humidity: " + data.list[0].main.humidity + "%";

                    cityInfo.textContent = cityName + " " + data.list[0].dt_txt;
                    console.log(cityInfo);
                    
                    var currentTimestamp = data.list[0].dt_txt.split(" ");
                    console.log(currentTimestamp);

                    for (var i = 0; i < data.list.length; i++) { //go through the weather data by date
                        let dateData = data.list[i].dt_txt.split(" ");
                        
                        if (dateData[0] == currentTimestamp[0]) { //if it's the same day as previously, continue on
                            continue;
                        } else { //note down the data
                            currentTimestamp = data.list[i].dt_txt.split(" ");
                            console.log(dateData);

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

    cityHistory.push(cityName);
    localStorage.setItem("cityWeatherHistory", cityHistory);
    
    

}

//console.log("Hello")

submitBtn.addEventListener('click', getCity);