const apiKey = "1455541f84830ff59fc67883bee93219";
var cityInputEl = document.querySelector("#citysearch");
var userFormEl = document.querySelector("#user-form");
var modalBodyEl = document.querySelector("#modal-city-display")
var savedCitiesEl = document.querySelector("#saved-city-list")
function formSubmitHandler(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    getGeoLocation(city);

}

function getGeoLocation(city) {
    var geoApiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;
    fetch(geoApiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);

                while (modalBodyEl.firstChild) {
                    modalBodyEl.removeChild(modalBodyEl.lastChild)
                }
                for (i = 0; i < data.length; i++ ) {   
                var returnedCity = data[i].name
                var returnedState = data[i].state
                var returnedCountry = data[i].country
                console.log(returnedCity +", "+ returnedState + ", " + returnedCountry);
                var cityEl = document.createElement("btn");
                cityEl.id = "city-btn"
                cityEl.classList = "btn btn-primary col-12 mb-2";
                cityEl.type = "button"
                cityEl.innerHTML = returnedCity + ", " + returnedState + ", " + returnedCountry;
                modalBodyEl.appendChild(cityEl);
                }
                $('#modal-city-select').modal('show');
            });
        } else {
            alert("Error: City Not Found");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather API");
    });
};

$("#modal-city-display").on("click", "#city-btn", function() {
    var citySelected = this.innerHTML;
    console.log(citySelected);
    var citySavedEl = document.createElement("btn");
    citySavedEl.id = "citySaved-btn"
    citySavedEl.classList = "col-12 btn btn-primary my-1";
    citySavedEl.type = "button"
    citySavedEl.innerHTML = citySelected;
    savedCitiesEl.appendChild(citySavedEl);
    $('#modal-city-select').modal("hide"); 
    var geoApiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + citySelected + "&limit=5&appid=" + apiKey;
    fetch(geoApiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var lat = data[0].lat
                var long = data[0].lon
                var weatherApiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + apiKey;
                fetch(weatherApiURL).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            console.log(data);
                            var baseIconEl = "<img src='http://openweathermap.org/img/wn/@2x.png'/>"
                            var weatherIcon = getweatherIconURL(baseIconEl, 43, data.current.weather[0].icon)
                            var uTime = new Date(data.current.dt * 1000)
                            document.querySelector("#city-name").innerHTML = citySelected + " " + (uTime.getMonth() + 1) + "/" + uTime.getDate() + "/" + uTime.getFullYear() + weatherIcon
                            document.querySelector("#temp").innerHTML = "Temp: " + data.current.temp + " °F";
                            document.querySelector("#wind").innerHTML = "Wind: " + data.current.wind_speed + " Mph";
                            document.querySelector("#humid").innerHTML = "Humidity: " + data.current.humidity + "%";
                            document.querySelector("#uvi").innerHTML = "UV-Index: " + data.current.uvi;
                            while (document.querySelector("#forecast").firstChild) {
                                document.querySelector("#forecast").removeChild(document.querySelector("#forecast").lastChild)
                            }
                                for (i=1; i < 6; i++) {
                                var uTime = new Date(data.daily[i].dt * 1000)
                                var forecastContainerEl = document.createElement("div");
                                forecastContainerEl.classList = "col-2 border-2 bg-secondary text-white"
                                var forecastDateEl = document.createElement("h4");
                                forecastDateEl.classList = "text-center m-0"
                                forecastDateEl.innerHTML = (uTime.getMonth() + 1) + "/" + uTime.getDate() + "/" + uTime.getFullYear()
                                forecastContainerEl.appendChild(forecastDateEl)
                                var forecastIconEl = document.createElement("img");
                                var baseIconURL ="http://openweathermap.org/img/wn/@2x.png"
                                forecastIconEl.src = getweatherIconURL(baseIconURL, 33, data.daily[i].weather[0].icon)
                                forecastIconEl.classList = "mx-auto d-block"
                                forecastContainerEl.appendChild(forecastIconEl)
                                var forecastTempEl = document.createElement("div");
                                forecastTempEl.classList = "mb-2"
                                forecastTempEl.innerHTML = "Temp: " + data.daily[i].temp.day + " °F";
                                forecastContainerEl.appendChild(forecastTempEl)
                                var forecastWindEL = document.createElement("div");
                                forecastWindEL.classList = "mb-2"
                                forecastWindEL.innerHTML = "Wind: " + data.daily[i].wind_speed + " Mph";
                                forecastContainerEl.appendChild(forecastWindEL)
                                var forecastHumidEL = document.createElement("div");
                                forecastHumidEL.classList = "mb-2"
                                forecastHumidEL.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
                                forecastContainerEl.appendChild(forecastHumidEL)
                                document.querySelector("#forecast").appendChild(forecastContainerEl)
                            }

                        });
                    } else {
                        alert("Error: City Not Found");
                    }
                })
                .catch(function(error) {
                    alert("Unable to connect to Open Weather API");
                });
            });
        } else {
            alert("Error: City Not Found");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather API");
    });
            

})

function getweatherIconURL(str, index, stringToAdd) {
return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

userFormEl.addEventListener("submit", formSubmitHandler)
