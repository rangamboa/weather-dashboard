// Declare variables.
var dateNow;
var requestUrl;

var cityInput = $('#city');
var cityName = $('#currentCity');
var currTemp = $('#cityTemp');
var currWind = $('#cityWind');
var currHum = $('#cityHum');
var currUv = $('#cityUv');
var currIcon = $('#wIcon');
var searchBtn = $('#search');
var cityList = $('#cityHistory');
var currUvColor;
var cityLat;
var cityLon;
var iconCode;
var iconUrl;
var searchTerm;

var cities = [];

function init() {

    // Retreive stored city names from localStorage.
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    // If cities were retrieved, then update the "cities" array.
    if (storedCities !== null) cities = storedCities;

    // Display array of stored city names.
    writeCities();
}

function writeCities() {

    // Resets city list display to re-write.
    cityList.empty();

    // Create a new button for each city in search history.
    for (var i = 0; i < cities.length; i++) {
        var cityItem = cities[i];
        cityList.append('<button class="btn btn-secondary btn-long searchBtn">'+cityItem+'</button>');
    }
}

function storeCities() {

    // Stringify object and set a key in localStorage to the "cities" array.
    localStorage.setItem("cities", JSON.stringify(cities));
}

function getDate() {

    // Get today's date to display in current weather window.
    var timeNow = moment().format("MM[/]DD[/]YYYY")
    $("#currentDate").text(timeNow);
}

cityList.on('click', function(event) {

    event.preventDefault();

    // Convert the search term to lowercase for easier string comparison.
    searchTerm = event.target.textContent.toLowerCase();

    // This loop cycles through the search history and moves the selected city to the top of the list, then displays current weather information.
    for (i = 0; i < cities.length; i++) {

        var recentCity = cities[i].toLowerCase();

        if (searchTerm === recentCity) {

            if (i == 0) return;
            cities.splice(i,1); 

            storeCities();
            writeCities();
        }
    }
    getLatLon(searchTerm);
});

searchBtn.on('click', function(event) {

    event.preventDefault();

    // If the same city is entered more than once, do not add to the search history.
    searchTerm = cityInput.val().toLowerCase();
    if (cities.length >= 1) var recentCity = cities[0].toLowerCase();

    if (searchTerm === '') {
        alert('Please enter a city name to\nsearch current weather and forecast.');
        return;
    } else if (searchTerm === recentCity) {
        return;
    } else {
        // Clear search field.
        cityInput.textContent = '';
        getLatLon(searchTerm);
    }
});

function getLatLon(searchTerm) {

    // Insert search term into geocoding API call.
    requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchTerm + '&limit=1&units=imperial&appid=b2a7b5db503cb0af44066eca2b902469';

    fetch(requestUrl)

        .then(response => response.json())
        .then(data => {

            // Retrieve latitudinal and longitudinal coordinates.
            cityLat = data[0].lat;
            cityLon = data[0].lon;   

            // Retrieve and display current city name from API response.
            cityName.text(data[0].name);

            // Store city name in first element array to be pushed to local storage.
            cities.unshift(data[0].name);

            // Store search items in array, then re-write history display. 
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

    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {

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
        if (data.current.uvi <= 2) { uvColor = 'white'; uvBg = 'green'; }
        else if (data.current.uvi <= 5) { uvColor = 'black'; uvBg = 'yellow'; }
        else if (data.current.uvi <= 7) { uvColor = 'black'; uvBg = 'orange'; }
        else { uvColor = 'white'; uvBg = 'red'; }

        currUv.css('color', uvColor);
        currUv.css('background-color', uvBg); 

        // Display forecast information in lower section of layout:

        // Loop through API data 5 times, once for each day in forecast.
        for (var i = 1; i < 6; i++) {

            // Specify the div ID in which to write data.
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

// Run initial functions to prep browser.
init();