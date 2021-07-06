// Declare variables.
var dateNow;
var requestUrl;

var buttonEl = $('.searchBtn');
var cityInput = $('#city');
var searchBtn = $('#search');
var cityName = $('#currentCity');
var currTemp = $('#cityTemp');
var currWind = $('#cityWind');
var currHum = $('#cityHum');
var currUv = $('#cityUv');
var currIcon = $('#wIcon');
var cityList = $('#cityHistory');
var currUvColor;
var cityLat;
var cityLon;
var iconCode;
var iconUrl;

var cities = [];

function init() {

    // Retreive stored city names from localStorage.
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    // If cities were retrieved, then update the "cities" array.
    if (storedCities !== null) cities = storedCities;

    writeCities();
}

function writeCities() {

    // Resets city list.
    cityList.empty();

    // Create a new button for each city in search history.
    for (var i = 0; i < cities.length; i++) {
        var cityItem = cities[i];
        cityList.append('<button class="btn btn-secondary btn-long searchBtn">'+cityItem+'</button>');
    }
    buttonEl = $('.searchBtn');
    console.log(buttonEl);
}

function storeCities() {
    // Stringify object and set a key in localStorage to "cities" array.
    localStorage.setItem("cities", JSON.stringify(cities));
}

function getDate() {
    var timeNow = moment().format("MM[/]DD[/]YYYY")
    $("#currentDate").text(timeNow);
}

buttonEl.on('click', function(event) {
    event.preventDefault();

    alert('clicked history');

    console.log(event.target.textContent);

    getLatLon(event.target.textContent);
});

searchBtn.on('click', function(event) {

    event.preventDefault();

    alert('click');

    console.log(event.target.textContent);

    if (searchBtn.text === '') return;

    // Retrieve search term.
    cityInput.textContent = '';

    getLatLon(event.target.textContent);

});

function getLatLon() {

    // Insert search term into geocoding API call.
    requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.val() + '&limit=1&units=imperial&appid=b2a7b5db503cb0af44066eca2b902469';

    // console.log(requestUrl);

    fetch(requestUrl)

        .then(response => response.json())
        .then(data => {

            // Retrieve latitudinal and longitudinal coordinates.
            cityLat = data[0].lat;
            cityLon = data[0].lon;

            // Retrieve and display current city name.
            cityName.text(data[0].name);

            cities.unshift(data[0].name);

            // Store city name in array to be pushed to local storage.
            // cities.unshift(data[0].name);

            console.log(cities);

            storeCities();
            writeCities();

            // Display current date.
            timeNow = moment().format("M[/]D[/]YYYY")
            $("#currentDate").text('('+timeNow+')');

            // Call function for API using lat and lon coordinates to obtain more information.
            getInfo();
        })
}

function getInfo() {

    // Insert latitude and longitude into API One Call.
    requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&exclude=minutely,hourly&appid=b2a7b5db503cb0af44066eca2b902469';    
    
    console.log(requestUrl);
    fetch(requestUrl)

        .then(response => response.json())
        .then(data => {
        console.log(data);

        // Display current weather icon.
        iconCode = data.current.weather[0].icon;
        iconCode.toString();
        iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png';
        currIcon.attr('src', iconUrl);

        // Display current weather info in upper section of layout.
        currTemp.text(data.current.temp);
        currWind.text(data.current.wind_speed);
        currHum.text(data.current.humidity);
        currUv.text(data.current.uvi);

        // Change font/background color for UV Index depending on value, for readability.
        if (data.current.uvi <= 2) {
            uvColor = 'white';
            uvBg = 'green';
        } else if (data.current.uvi <= 5) {
            uvColor = 'black';
            uvBg = 'yellow';
        } else if (data.current.uvi <= 7) {
            uvColor = 'black';
            uvBg = 'orange';
        } else {
            uvColor = 'white';
            uvBg = 'red';
        }
        currUv.css('color', uvColor);
        currUv.css('background-color', uvBg); 

        // Display forecast information in lower section of layout:

        // Loop through API data 5 times, once for each day in forecast.
        for (var i = 1; i < 6; i++) {

            // Set the div in which to write data.
            var dayId = '#day' + i;

            // Pull data and convert to string.
            var futureDate = moment(data.daily[i].dt, 'X').format('M[/]D[/]YYYY');
            var futureIcon = (data.daily[i].weather[0].icon).toString();
            var futureTemp = (data.daily[i].temp.day).toString();
            var futureWind = (data.daily[i].wind_speed).toString();
            var futureHum = (data.daily[i].humidity).toString();  

            // Empty div of prior data, then generate list items dynamically.
            $(dayId).empty();
            $(dayId).append('<ul class="list-group list-group-flush">');
            $(dayId).append('<li class="list-group-item dailyCard"><h5>'+futureDate+'</h5></li>');
            $(dayId).append('<li class="list-group-item dailyCard"><img src="http://openweathermap.org/img/w/'+futureIcon+'.png" /></li>');
            $(dayId).append('<li class="list-group-item dailyCard">Temp: '+futureTemp+' &deg;F</li>');
            $(dayId).append('<li class="list-group-item dailyCard">Wind: '+futureWind+' MPH</li>');
            $(dayId).append('<li class="list-group-item dailyCard">Humidity: '+futureHum+'%</li>');
            $(dayId).append('</ul>');
        }
      
    });
}

init();