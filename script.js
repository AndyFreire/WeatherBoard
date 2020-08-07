$(document).ready(function(){

    var searchInput = $("#search-input");

    var APIKey = "d4c857a90bc7858cb047e27450d675a0";

    var currentCity = "";
    var storedCities = [];
    var numberOfDays = 5;

    // Initialize the app
    init();




    // When the search button is clicked...
    $("#search-btn").on("click", function(){

        // Build the queryURL with input and APIKey
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + searchInput.val() + "&appid=" + APIKey;

        // Clear the search field
        searchInput.val("");

        // Call OpenWeather API
        $.ajax({
            url:  queryURL,
            method: 'GET'
        }).then(function(response){

            console.log(response);

            // Store the city in our array
            storedCities.push(response.name);
            localStorage.setItem("cities", JSON.stringify(storedCities));

            // Get our weather data section
            var weatherSection = $("#weather-data");

            // Clear the HTML
            weatherSection.html("");

            // Render today's weather
            var weatherDiv = $("<div>");
            weatherDiv.attr("class", "row m-3");

            weatherDiv.html("<div class='card w-100 mb-4'><div class='card-body'><h2 class='card-title'>" + response.name + " " +  moment().format('l') + "</h2> <p class='card-text'>Temperature: " + response.main.temp + " °F</p> <p class='card-text'>Humidity: " + response.main.humidity + "%</p><p class='card-text'>Wind Speed: " + response.wind.speed + "MPH</p> <p class='card-text'>UV Index: <button type='button' class='btn btn-danger'>9.49</button></p></div></div>")

            weatherSection.append(weatherDiv);


        });

    });

    function init(){
        renderCities();
    }


    function renderCities(){

        // Grab the cities list element
        var citiesList = $("#cities-list");

        // Clear it
        citiesList.html("");

        // Grab the cities in localStorage,
        if (localStorage.getItem("cities")){
            storedCities = JSON.parse(localStorage.getItem("cities"));
        }

        if (storedCities){

            storedCities.forEach(city => {
                // Create a new list item
                var li = $("<li>");
    
                // Set the bootstrap classes
                li.attr("class", "list-group-item d-flex justify-content-between align-items-center");
    
                // Update the city name and add an icon inside the li
                li.html(city + "<i class='fa fa-building'></i>");
    
                // Append to our html element
                citiesList.append(li);
    
            });    

        }
    }

    function renderTodaysWeather(weatherData){

        // Get our weather data section
        var weatherSection = $("#weather-data");

        // Clear the HTML
        weatherSection.html("");

        if (currentCity){
            // Render the current city's weather
            // var weatherDiv = $("<div>");
            // weatherDiv.attr("class", "row m-3");

            // weatherDiv.html("<div class='card w-100 mb-4'><div class='card-body'><h2 class='card-title'>" + currentCity + " " +  moment().format('l') + "</h2> <p class='card-text'>Temperature: 90.9 °F</p> <p class='card-text'>Humidity:" + + "</p><p class='card-text'>Wind Speed:  + 4.7 MPH + </p> <p class='card-text'>UV Index: <button type='button' class='btn btn-danger'> + 9.49 + </button></p></div></div>")

            // weatherSection.append(weatherDiv);

        } else {
            // Display prompt to user
        }

    }




});