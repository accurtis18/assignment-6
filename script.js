$(document).ready(function(){
    var localCities = localStorage.getItem("cities");
    var cities = [];
    var city = '';
    var fullCast = true;
    var unit = "imperial";
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
                // url: 'https://free.ipwhois.io/json/',
                // method: 'GET'
            }).then(function(response){
                console.log(response);
                city = response.city;
                cities.unshift(city.trim());
                localStorage.setItem("cities", JSON.stringify(cities));
                getCurrentForecast(city, fullCast);
            });
    }

    function search(city){
        cities.unshift(city.trim());
        cities.splice(5);
        localStorage.setItem("cities", JSON.stringify(cities));
        getCurrentForecast(city.trim(), fullCast);
        $('#searchWeather').val("");
        writeCityHistory(cities);
    }
    
    $('#searchWeather').keypress(function (e) {
        if (e.which == 13) {
            city = $('#searchWeather').val();
            search(city);
          return false;
        }
      });

    $('#search').on('click', function(){
        city = $('#searchWeather').val();
        search(city);
    });

    $('.history').on("click", '#cityHis', function(){
            city = $(this).closest('#cityHis').text();
            search(city);
    });

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


    //error response for incorrect cities/make sure it doesn't push or delete if it already has
    //add celsius toggle
    function getCurrentForecast(city, full){
        var key = '9a89782c5d73128c63edf8b5a4c73c28';
    
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key +'&units=' + unit,
            method: 'GET'
        }).then(function(response){
            console.log(response);
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
            console.log(response);
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

    function writeCityHistory(cities){
        $('.history').html("");
        for(city of cities){
            $('.history').append(`<li class="list-group-item"> <a class="his" id="cityHis" href="#">${city}</a></li>`);
        }
    }

    // var autocomplete;
    // autocomplete = new google.maps.places.Autocomplete((document.getElementById('searchWeather')), {
    //     types: ['geocode'],});

    //     google.maps.event.addListener(autocomplete, 'place_changed', function(){
    //         var near_place = autocomplete.getPlace();
    //         $('#lat').val() = near_place.geometry.location.lat();
    //         $('#long').val() = near_place.geometry.location.lng();
    //         $('.viewLat').append(near_place.geometry.location.lat())
    //         $('.viewLong').append(near_place.geometry.location.lng());
    //     }); 
  

});

 

// $(document).on('change', '#searchWeather', function(){
//     $('#lat').val() = '';
//     $('#long').val() = '';
//     $('.viewLat').html("");
//     $('.viewLong').html("");
// });