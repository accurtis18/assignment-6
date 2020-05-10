$(document).ready(function(){
    //initializing values to be used including local storage values and unit measurement value
    var localCities = localStorage.getItem("cities");
    var cities = [];
    var city = '';
    var fullCast = true;
    var unit = "imperial";

    //idnetifing if there are is any search history, if not, identify nearby location to present weather
    if(localCities !== null && localCities !== ""){
        cities = JSON.parse(localCities);
        city = cities[0];
        getCurrentForecast(city, fullCast);
        writeCityHistory(cities);
    } else{
            $.ajax({
                    "async": true,
                    "crossDomain": true,
                    "url": "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/",
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
                        "x-rapidapi-key": "4160692450msh57c7f939866117fp13f0ccjsn2faf3ca7bcb3"
                    }
            }).then(function(response){
                city = response.city;
                cities.unshift(city.trim());
                localStorage.setItem("cities", JSON.stringify(cities));
                getCurrentForecast(city, fullCast);
            });
    }

    //function to add a city search for to search history and call weather forecast for the city
    function search(city){
        cities.unshift(city.trim());
        cities.splice(5);
        localStorage.setItem("cities", JSON.stringify(cities));
        getCurrentForecast(city.trim(), fullCast);
        $('#searchWeather').val("");
        writeCityHistory(cities);
    }
    
    //searches on enter
    $('#searchWeather').keypress(function (e) {
        if (e.which == 13) {
            city = $('#searchWeather').val();
            search(city);
          return false;
        }
      });

      //searches on click
    $('#search').on('click', function(){
        city = $('#searchWeather').val();
        search(city);
    });

    //allows user to click on a previous search to show current and future weather
    $('.history').on("click", '#cityHis', function(){
            city = $(this).closest('#cityHis').text();
            search(city);
    });

    //function to change the weather on the page if the switch is flipped from C to F
    $('#switchDegree').on('click',function(){
        if(unit === "imperial"){
            unit = "metric";
            $('.slider').html("C&#176");
            $('.slider').css({textAlign :'left',
                                paddingLeft :'4px'});
        } else{
            unit = "imperial";
            $('.slider').html("F&#176");
            $('.slider').css('text-align','right');
        }
        city = cities[0];
        getCurrentForecast(city, fullCast);
    });


    //function to grab current weather, catches if there is an error in the response, calls future weather
    function getCurrentForecast(city, full){
        var key = '9a89782c5d73128c63edf8b5a4c73c28';
    
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key +'&units=' + unit,
            method: 'GET'
        }).then(function(response){
            if(full){
                $('.city').html(`${response.name} <img src='http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png'/>`);
                $('.temp').html(`Temp: ${Math.floor(response.main.temp)}&#176 and ${response.weather[0].description}`);
                $('.humid').html(`Humidity: ${response.main.humidity}%`);
                $('.wind').html(`Wind: ${response.wind.speed} MPH`);
                getFutureForecast(response);
            } else{
                // return response.main.temp;
            }
        }).catch(function(error){
            alert("We couldn't find that city. Please try again.")
            cities.shift();
            localStorage.setItem("cities", JSON.stringify(cities));
            writeCityHistory(cities);
        });        
    };

    //functional is called at end of current weather function
    //calls the future forecast API for future five days, using lat lon of previous api call
    //gather the UV index for the current day as it's only available in this api
    function getFutureForecast(response){
        var key = '9a89782c5d73128c63edf8b5a4c73c28';
        var futureDays = 0;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvClass = ""
        $('.future').html('');

        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' +lat + '&lon=' + lon + '&exclude=hourly&appid=' + key +'&units=' + unit,
            method: 'GET'
        }).then(function(response){
            while(futureDays < 5){
                $('.future').append(`<div class="card">
                <div class="card-header">
                    ${moment().add((futureDays+1), 'days').format('l')}
                </div>
                <div class="card-body">
                    <p><img class="futureImg" src='http://openweathermap.org/img/wn/${response.daily[futureDays].weather[0].icon}@2x.png'/></p>
                    <p>Temp: ${Math.floor(response.daily[futureDays].temp.day)}&#176</p>
                    <p>Humidity: ${response.daily[futureDays].humidity}%</p>
                </div>
            </div>`);
            futureDays++;
            };
            if(response.current.uvi < 3){
                uvClass = "safe"
            } else if(response.current.uvi < 6){
                uvClass = "moderate"
            } else{
                uvClass = "danger"
            }

            $('.uv').html(`UV Index: <label class="uvLabel ${uvClass}">${response.current.uvi}</lable>`);
        });

    }

    //write history to page on load, is called when a new search is performed to update.
    function writeCityHistory(cities){
        $('.history').html("");
        for(city of cities){
            $('.history').append(`<li class="list-group-item"> <a class="his" id="cityHis" href="#">${city}</a></li>`);
        }
    }
});

 
