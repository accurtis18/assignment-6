$(document).ready(function(){
    getCurrentForecast();
    getFutureForecast();

    function getCurrentForecast(){
        var key = '9a89782c5d73128c63edf8b5a4c73c28';
        var lat = '41.85';
        var lon = '-87.65';
    
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&appid=' + key +'&units=imperial',
            method: 'GET'
        }).then(function(response){
            console.log(response);
            $('.city').html(`${response.timezone} <img src='http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png'/>`);
            $('.temp').html(`Temp: ${Math.floor(response.current.temp)}&#176 and ${response.current.weather[0].description}`);
            $('.humid').html(`Humidity: ${response.current.humidity}%`);
            $('.wind').html(`Wind: ${response.current.wind_speed} MPH`);
            $('.uv').html(`UV Index: ${response.current.uvi}`);
        });
    
    };

    function getFutureForecast(){
        var futureDays = 0;

        while(futureDays < 5){
            $('.future').append(`<div class="card">
            <div class="card-header">
                <h2>Day ${futureDays}</h2>
            </div>
            <div class="card-body">
                body
            </div>
            <div class="card-footer">
               Footer
            </div>
        </div>`);
        futureDays++;
        };

    }

});

