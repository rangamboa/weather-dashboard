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
var currIcon = $('#wIcon');
var currUvColor;
var cityLat;
var cityLon;
var iconCode;
var iconUrl;

var forecast = [];

function getDate() {
    var timeNow = moment().format("MM[/]DD[/]YYYY")
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

            // Retrieve latitudinal and longitudinal coordinates.
            cityLat = data[0].lat;
            cityLon = data[0].lon;



            // Retrieve and display current city name.
            cityName.text(data[0].name);

            timeNow = moment().format("MM[/]DD[/]YYYY")
            $("#currentDate").text('('+timeNow+')');

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
            var futureDate = moment(data.daily[i].dt, 'X').format('MM[/]DD[/]YYYY');
            var futureIconCode = (data.daily[i].weather[0].icon).toString();
            var futureTemp = (data.daily[i].temp.day).toString();
            var futureWind = (data.daily[i].wind_speed).toString();
            var futureHum = (data.daily[i].humidity).toString();  

            // Empty div of prior data, then generate dynamically with list items.
            $(dayId).empty();
            $(dayId).append('<ul class="list-group list-group-flush">');
            $(dayId).append('<li class="list-group-item dailyCard"><h5>'+futureDate+'</h5></li>');
            $(dayId).append('<li class="list-group-item dailyCard"><img src="http://openweathermap.org/img/w/'+futureIconCode+'.png" /></li>');
            $(dayId).append('<li class="list-group-item dailyCard">'+futureTemp+' &deg;F</li>');
            $(dayId).append('<li class="list-group-item dailyCard">'+futureWind+' MPH</li>');
            $(dayId).append('<li class="list-group-item dailyCard">'+futureHum+' %</li>');
            $(dayId).append('</ul>');
        }
      
    });
}

function invalidEntry() {
    alert('pck a real city you hoser');
}

