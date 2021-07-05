console.log('js script linked');

// Declare variables.
var cityInput = $('#city');
var searchBtn = $('#search')
var requestUrl;
var responseText = document.getElementById('response-text');

// Collect search term from form.
searchBtn.on('click', function(event) {

    event.preventDefault();
    cityInput = cityInput;
    console.log(cityInput.val());

    requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.val() + '&limit=1&appid=b2a7b5db503cb0af44066eca2b902469';

    console.log(requestUrl);

    fetch(requestUrl)
    .then(function (response) {
        console.log(response);
        // if (response.status === 200) {
        //     responseText.textContent = response.status;
        // }
        // return response.json();

        console.log(response.json());
  });
});

// getApi(requestUrl);



