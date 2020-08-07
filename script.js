$(document).ready(function () {

    var searchInput = $("#search-input");

    var APIKey = "d4c857a90bc7858cb047e27450d675a0";

    var currentCity = "";
    var storedCities = [];
    var numberOfDays = 5;

    var navWeatherIcon = $("#nav-weather-icon");

    // Initialize the app
    init();




    // When the search button is clicked...
    $("#search-btn").on("click", function () {

        renderWeatherData(searchInput.val());

        // Clear the search field
        searchInput.val("");

    });

    // When a city button is clicked...
    $(document).on("click", ".city-button", function(){

        var cityName = $(this).data("city");

        renderWeatherData(cityName);
        
    })


    function init() {
        renderCities();
    }


    function renderCities() {

        // Grab the cities list element
        var citiesList = $("#cities-list");

        // Clear it
        citiesList.html("");

        // Grab the cities in localStorage,
        if (localStorage.getItem("cities")) {
            storedCities = JSON.parse(localStorage.getItem("cities"));
        }

        if (storedCities) {

            storedCities.forEach(city => {
                // Create a new list item
                var li = $("<li>");

                // Set the bootstrap classes
                li.attr("class", "city-button list-group-item d-flex justify-content-between align-items-center");
                li.attr("data-city", city);

                // Update the city name and add an icon inside the li
                li.html(city + "<i class='fa fa-building'></i>");

                // Append to our html element
                citiesList.append(li);

            });

        }
    }

    function renderWeatherData(cityName) {

        // Build the queryURL with input and APIKey
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + cityName + "&appid=" + APIKey;

        // Call OpenWeather API
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            // Get the latitude and longitude for Response 1
            var lat = response.coord.lat;
            var lon = response.coord.lon;

            currentCity = response.name;

            // Store the city in our array if its not already there
            if (!storedCities.includes(currentCity)) {
                storedCities.push(currentCity);
                localStorage.setItem("cities", JSON.stringify(storedCities));
            }
            // Update the cities view
            renderCities();

            var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + APIKey;

            $.ajax({
                url: queryURL2,
                method: 'GET'
            }).then(function (oneCallResponse) {

                console.log(oneCallResponse);

                // Get our weather data section
                var weatherSection = $("#weather-data");

                // Clear the HTML
                weatherSection.html("");

                // Render today's weather
                var weatherDiv = $("<div>");
                weatherDiv.attr("class", "row m-3");

                // Parse the UV Index
                var uvIndex = oneCallResponse.current.uvi;
                var conditions = "secondary";

                switch (true) {
                    case uvIndex <= 5: conditions = "success";
                        break;
                    case uvIndex > 5 && uvIndex <= 7: conditions = "warning";
                        break;
                    case uvIndex > 7: conditions = "danger";
                        break;
                    default: conditions = "secondary"
                }

                // Update the weather div with today's weather and date
                weatherDiv.html("<div class='card w-100 mb-4'><div class='card-body'><h2 class='card-title'>" + currentCity + " " + moment().format('l') + "</h2> <p class='card-text'>Temperature: " + oneCallResponse.current.temp + " °F</p> <p class='card-text'>Humidity: " + oneCallResponse.current.humidity + "%</p><p class='card-text'>Wind Speed: " + oneCallResponse.current.wind_speed + " MPH</p> <p class='card-text'>UV Index: <button type='button' class='btn btn-" + conditions + "'>" + uvIndex + "</button></p></div></div>");

                weatherSection.append(weatherDiv);

                // Update the nav icon
                navWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + oneCallResponse.current.weather[0].icon + ".png");

                // Render the forecast title
                var forecastTitle = $("<h2>");
                forecastTitle.attr("class", "row m-3");
                forecastTitle.text("5-Day Forecast");

                weatherSection.append(forecastTitle);

                // Render the 5 day forecast cards
                var forecastDiv = $("<div>");
                forecastDiv.attr("class", "row m-3");

                // Get the daily forecast array
                var dailyForecast = oneCallResponse.daily;

                for (var i = 0; i < numberOfDays; i++) {

                    // Create a new div for each day
                    var forecastCard = $("<div>");

                    var forecastDate = convertDate(dailyForecast[i].dt);

                    var iconURL = "http://openweathermap.org/img/wn/" + dailyForecast[i].weather[0].icon + "@2x.png";

                    forecastCard.html("<div class='card bg-custom forecast-card m-2'> <div class='card-body'> <h5 class='card-title'>" + forecastDate + "</h5> <img src='" + iconURL + "' alt='weather-icon'><p class='card-text'> Temp: " + dailyForecast[i].temp.day + " °F </p> <p class='card-text'>Humidity: " + dailyForecast[i].humidity + "%</p> </div> </div>");

                    forecastDiv.append(forecastCard);

                }

                weatherSection.append(forecastDiv);


            })

        });

    }

    function convertDate(timestamp) {

        // multiply the timestamp by 1000 and create as a new date
        var date = new Date(timestamp * 1000);

        // Get the month
        var month = date.getMonth() + 1;

        // Day
        var day = date.getDate() + 1;

        // Get the year
        var year = date.getFullYear();

        return month + "/" + day + "/" + year;

    }




});