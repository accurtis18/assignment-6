$(document).ready(function(){
    getForecast();

    function getForecast(){
        var key = '9a89782c5d73128c63edf8b5a4c73c28';
        var city = 'Chicago,US';
    
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key +'&units=imperial',
            method: 'GET'
        }).then(function(response){
            console.log(response);
            $('.city').html(`${response.name} <img src='http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png'/>`);
            $('.temp').html(`Temp: ${Math.floor(response.main.temp)}&#176 and ${response.weather[0].description}`);
            $('.humid').html(`Humidity: ${response.main.humidity}%`);
            $('.wind').html(`Wind: ${response.wind.speed} MPH`);
            console.log(response)
        });
    
    }

});

