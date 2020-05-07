$(document).ready(function(){
    var localCities = localStorage.getItem("cities");
    var cities = [];
    var city = '';
    if(localCities !== null && localCities !== ""){
        cities = JSON.parse(localCities);
        city = cities[0];
    } else{
        city = 'Chicago';
    }

    getCurrentForecast(city);
    
    $('#search').on('click', function(){
        city = $('#searchWeather').val();
        getCurrentForecast(city);
    });

    function getCurrentForecast(city){
        var key = '9a89782c5d73128c63edf8b5a4c73c28';
    
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + key +'&units=imperial',
            method: 'GET'
        }).then(function(response){
            console.log(response);
            $('.city').html(`${response.city.name} <img src='http://openweathermap.org/img/wn/${response.list[5].weather[0].icon}@2x.png'/>`);
            $('.temp').html(`Temp: ${Math.floor(response.list[5].main.temp)}&#176 and ${response.list[5].weather[0].description}`);
            $('.humid').html(`Humidity: ${response.list[5].main.humidity}%`);
            $('.wind').html(`Wind: ${response.list[5].wind.speed} MPH`);
            // $('.uv').html(`UV Index: ${response.current.uvi}`);
            getFutureForecast(response);
        });        
    };

    function getFutureForecast(response){
        var futureDays = 0;
        var listItem = 5;
        $('.future').html('');

        while(futureDays < 5){
            $('.future').append(`<div class="card">
            <div class="card-header">
                ${moment().add((futureDays+1), 'days').format('l')}
            </div>
            <div class="card-body">
                <p><img src='http://openweathermap.org/img/wn/${response.list[listItem].weather[0].icon}@2x.png'/></p>
                <p>Temp: ${Math.floor(response.list[listItem].main.temp)}&#176</p>
                <p>Humidity: ${response.list[listItem].main.humidity}%</p>
            </div>
        </div>`);
        futureDays++;
        listItem += 8;
        };
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