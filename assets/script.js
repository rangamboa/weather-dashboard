// Declare variables.
var dateNow;
var requestUrl;

var cityInput = $('#city');
var searchBtn = $('#search');
var cityName = $('#currentCity');
var currTemp = $('#cityTemp');
var currWind = $('#cityWind');
var currHum = $('#cityHum');
var currUv = $('#cityUv');
var currUvColor;
var cityLat;
var cityLon;

var forecast = [];

function getDate() {
    timeNow = moment().format("MM[/]DD[/]YYYY")
    $("#currentDate").text(timeNow);
}

// Listen for a click on the Search button.
searchBtn.on('click', function(event) {

    event.preventDefault();

    // Retrieve search term.
    cityInput = cityInput;
    console.log(cityInput.val());

    // Insert search term into geocoding API call.
    requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.val() + '&limit=1&units=imperial&appid=b2a7b5db503cb0af44066eca2b902469';

    // console.log(requestUrl);

    fetch(requestUrl)

        .then(response => response.json())
        .then(data => {
            // console.log(data);

            // Retrieve latitudinal and longitudinal coordinates.
            cityLat = data[0].lat;
            cityLon = data[0].lon;

            // Retrieve and display current city name.
            cityName.text(data[0].name);

            // Call function for API using lat and lon coordinates to obtain more information.
            getInfo();
        })
});

function getInfo() {

    // Insert latitude and longitude into API One Call.
    requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&exclude=minutely,hourly&appid=b2a7b5db503cb0af44066eca2b902469';    
    
    console.log(requestUrl);

    fetch(requestUrl)

        .then(response => response.json())
        .then(data => {
        console.log(data);
        // console.log(data.current.temp);


        // Display current weather info in upper section of layout.
        currTemp.text(data.current.temp);
        currWind.text(data.current.wind_speed);
        currHum.text(data.current.humidity);
        currUv.text(data.current.uvi);

        // Change font/background color for UV Index depending on value.
        if(data.current.uvi <= 2) {
            uvColor = 'white';
            uvBg = 'green';
        } else if(data.current.uvi <= 5) {
            uvColor = 'black';
            uvBg = 'yellow';
        } else if(data.current.uvi <= 7) {
            uvColor = 'black';
            uvBg = 'orange';
        } else {
            uvColor = 'white';
            uvBg = 'red';
        }
        currUv.css('color', uvColor);
        currUv.css('background-color', uvBg);
        

        // Display 5-day forecast info in lower section of layout.
    });
}

// Retrieve today's date from Moment.js.
getDate();

