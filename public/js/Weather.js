const key = '4240f00cca3ecdaea7524a862117c079';
const cityID = 6173331  // id for Vancouver

function getWeather() {
    if(key.length != 32) 
    {
        document.getElementById('temp').innerHTML = ('Incorrect API KEY!');
        return;
        
    }
	fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)  
    .then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(data) {
		designWeather(data);
	})
	.catch(function() {
        document.getElementById('temp').innerHTML = ('Response Error');
	});
}
function designWeather( d ) {
    var celcius = Math.round(parseFloat(d.main.temp)-273.15);
    //var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);
    var description = d.weather[0].description; 
	
	document.getElementById('description').innerHTML = description;
	document.getElementById('temp').innerHTML = celcius + '&deg;';
	document.getElementById('location').innerHTML = d.name;
  
  if( description.indexOf('rain') > 0 || description.indexOf('storm') > 0) {
      document.getElementById('weather').style.backgroundImage = "url(http://bestanimations.com/Nature/Water/rain/rain-nature-animated-gif-21.gif)";
  }
  else {
  	document.getElementById('weather').style.backgroundImage = "url(https://i.pinimg.com/originals/20/e6/03/20e60377fb5710a7335be9bec1884877.gif)"
  }
}