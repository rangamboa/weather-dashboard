// Declare variables.
var cityInput = $('#city');
var searchBtn = $('#search')
var cityLat;
var cityLon;
var requestUrl;
var responseText = document.getElementById('response-text');

// Collect search term from form.
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
            console.log(data);

            // Retrieve latitudinal and longitudinal coordinates.
            cityLat = data[0].lat;
            cityLon = data[0].lon;

            console.log('lat ' + cityLat + ' lon ' + cityLon);
        })


});



