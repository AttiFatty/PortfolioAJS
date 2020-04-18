/*to link my personal api key in one place first for easier use*/
const apiKey = "fe42b2c146dd1a39d1def1f468f5c416";
$(document).ready(function () {


/*this was my third attempt at writing a funtcion for this and im pretty sure it works but im not sure I really understand what I did right*/
    function getCityHistory() {
        var history = JSON.parse(localStorage.getItem("citySearchHistory"))
        if (history === null) {
            history = [];
        }
        return history;
    }


    var citySearchHistory = getCityHistory();
   for (var i = 0; i < citySearchHistory.length; i++){
       generateCityBtn(citySearchHistory[i]);
   }


    var currentDayNow;
    setInterval(() => {
        currentDayNow = moment().format("MMMM Do YYYY");
    }, 1000)
     





    function mainDisplay(cityNameInput) {

        // var cityNameInput = $("#inputCityName").val().trim().toLowerCase();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityNameInput + "&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            var mainNameDisplay = response.name;
            var mainNameDisplayCountry = response.sys.country
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = response.wind.speed

            var longitude = response.coord.lat;;
            var latitude = response.coord.lon
            var getIcon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
            let icon = $("<img>").attr("src", getIcon);

            //main Display box
            $("#cityNameDisplay").text("Name: " + mainNameDisplay + " , " + mainNameDisplayCountry + ". " + currentDayNow).append(icon);
            $("#temperature").text("Temperature(F): " + temp);
            $("#humidity").text("Humidity: " + humidity + " %");
            $("#windSpeed").text("Wind Speend: " + windSpeed + " MPH");

            //uv index portion
            let uvqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + longitude + "&lon=" + latitude
            $.ajax({
                url: uvqueryURL,
                method: "GET"
            }).then(function (response) {
                $("#uvIndex").text("UV Index: " + response.value)
                if (response.value < 3) {
                    $("#uvIndex").removeClass().addClass("badge badge-success");
                } else if (response.value > 2 && response.value < 8) {
                    $("#uvIndex").removeClass().addClass("badge badge-warning")
                } else {
                    $("#uvIndex").removeClass().addClass("badge badge-danger")
                }
            });

        })
    }
    //5day forecast display
    function forecastData(cityNameInput) {
        // var cityNameInput = $("#inputCityName").val().trim().toLowerCase();
        var forcastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityNameInput + "&units=imperial&appid=" + apiKey
        $.ajax({
            url: forcastQueryURL,
            method: "GET",
        }).then(function (forecastResponse) {
            console.log(forecastResponse);

            for (var i = 0; i < forecastResponse.list.length; i++) {
                var response = forecastResponse.list[i];
                var forecast = new Date(response.dt_txt);

                if (forecast.getHours() === 12) {
                    var forecastDay = $("<div>").text(response.dt_txt);
                    var getForecastIcon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
                    var forecastIcon = $("<img>").attr("src", getForecastIcon);

                    var forceastDayTemp = $("<div>").text("Temp(F): " + response.main.temp);

                    var forecaseDayHumidity = $("<div>").text("Humidity: " + response.main.humidity + "%");

                    $(".forecastDisplayBox").append($("<div>").addClass(" col-2 col-md-2 col-lg-2 border border-primary m-2").append(forecastDay, forecastIcon, forceastDayTemp, forecaseDayHumidity))
                }
            }
        });
    }
    function storeCities() {
        var cityName = $("#inputCityName").val().trim().toLowerCase();
        citySearchHistory.push(cityName.toString())
        citySearchHistory = citySearchHistory.slice(-5);
        console.log(citySearchHistory);

        localStorage.setItem("citySearchHistory", JSON.stringify(citySearchHistory))
    }

    function generateCityBtn(cityNameInput) {
        var citySearchbutton = $("<button>");
        citySearchbutton.attr("data-name", cityNameInput);
        citySearchbutton.addClass("btn btn-secondary m-1")
        citySearchbutton.text(cityNameInput);
        citySearchbutton.on("click", function () {
            $(".forecastDisplayBox").html("");
            mainDisplay(cityNameInput);
            forecastData(cityNameInput);
        })
        $("#citySearchList").prepend(citySearchbutton);
    }
    $("#searchbutton").on("click", function () {
        $(".forecastDisplayBox").html("");

        var cityNameInput = $("#inputCityName").val().trim().toLowerCase();
        if (cityNameInput == "") {
            alert("Field cannot be empty")
            return;
        } else {
            mainDisplay(cityNameInput);
            forecastData(cityNameInput);
        }
        storeCities();
        console.log(citySearchHistory.length)
        console.log(citySearchHistory)
        if ( citySearchHistory.length < 5){
            generateCityBtn(cityNameInput);
        }
        else {
            $("#citySearchList button").last().remove();
            generateCityBtn(cityNameInput)
        }
       $("#inputCityName").val("") ;

    })
    $("#clearButton").on("click", function () {
        $(".mainDisplay").hide();
        $("#forecastDisplayHeader").hide();
        $(".forecastDisplayBox").hide();
        $("#citySearchList").empty();
        localStorage.clear();
    })
});