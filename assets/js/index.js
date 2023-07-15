//fa580f314369e2c9d603e57405e54a92

//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

var searchHistory = document.getElementById('search-history');
var submitBtn = document.getElementById('submit-button');

function getCity() {
    var cityName = document.getElementById('citynamefield').value;
    var coords = {};
    var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",US&appid=fa580f314369e2c9d603e57405e54a92";
    console.log("City searched: " + cityName);

    fetch(geoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            coords.lat = data[0].lat;
            coords.lon = data[0].lon
            console.log(coords);

            var cityURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=fa580f314369e2c9d603e57405e54a92`;
            fetch(cityURL)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    console.log(data);
                })
        })

}

//console.log("Hello")

submitBtn.addEventListener('click', getCity);