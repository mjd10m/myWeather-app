const apiKey = "1455541f84830ff59fc67883bee93219";
var cityInputEl = document.querySelector("#citysearch");
var userFormEl = document.querySelector("#user-form");
var modalBodyEl = document.querySelector("#modal-city-display")  
var savedCitiesEl = document.querySelector("#saved-city-list")
const forecastTitleEl = document.querySelector('#forecast-title')
const currentWeatherContainer = document.querySelector("#current")
var storedCities = []

//handles when the search button is clicked
function formSubmitHandler(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    getGeoLocation(city);
    cityInputEl.value = ""
}
//handles when the button of a previously searched city is clicked
function saveCityBtnHandler() {
    var citySelected = this.innerHTML
    getWeatherData(citySelected)
}
//handles the city selected from the modal
function formCitySelectHandler() {
    var citySelected = this.innerHTML;
    storedCities.push(citySelected)
    if(storedCities.length > 7) {
        storedCities = storedCities.splice(1,7)
    }
    saveCityArray(storedCities);
    historicalCities(storedCities);
    $('#modal-city-select').modal("hide");
    getWeatherData(citySelected) 
}
//makes an api call to get up to 5 cities that match the searh input 
function getGeoLocation(city) {
    var geoApiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;
    fetch(geoApiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                while (modalBodyEl.firstChild) {
                    modalBodyEl.removeChild(modalBodyEl.lastChild)
                }
                for (i = 0; i < data.length; i++ ) {   
                var returnedCity = handleUndefines(data[i].name)
                var returnedState = handleUndefines(data[i].state)
                var returnedCountry = handleUndefines(data[i].country)
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
//replaces an undefined values with a blank
function handleUndefines(text) {
    if (text === undefined){
        text = ''
    } else {
        text = text
    }
    return text
}
//creates the previous searched cities as a button and displays below the search bar
function historicalCities(storedCities) {
    while (savedCitiesEl.firstChild) {
        savedCitiesEl.removeChild(savedCitiesEl.lastChild)
    }
    for (i=storedCities.length - 1; i >= 0; i--) {
        var citySavedEl = document.createElement("btn");
        citySavedEl.id = "citySaved-btn"
        citySavedEl.classList = "col-12 btn btn-primary my-1";
        citySavedEl.type = "button"
        citySavedEl.innerHTML = storedCities[i];
        savedCitiesEl.appendChild(citySavedEl);
    }
}
//saves the array of previously search cities to local storage
function saveCityArray(storedCities) {
    localStorage.setItem("cities", JSON.stringify(storedCities))
}
//gets the weather information and adds it to the page
function getWeatherData(citySelected) {
    var geoApiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + citySelected + "&limit=5&appid=" + apiKey;
    fetch(geoApiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat
                var long = data[0].lon
                var weatherApiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + apiKey;
                fetch(weatherApiURL).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            var baseIconEl = "<img src='http://openweathermap.org/img/wn/@2x.png'/>" //how to escape default behavior
                            var weatherIcon = spliceInText(baseIconEl, 43, data.current.weather[0].icon)
                            var uvSpan = uvSpanCreate(data.current.uvi)
                            var uTime = new Date(data.current.dt * 1000)
                            document.querySelector("#city-name").innerHTML = citySelected + " " + (uTime.getMonth() + 1) + "/" + uTime.getDate() + "/" + uTime.getFullYear() + weatherIcon
                            document.querySelector("#temp").innerHTML = "Temp: " + data.current.temp + " °F";
                            document.querySelector("#wind").innerHTML = "Wind: " + data.current.wind_speed + " Mph";
                            document.querySelector("#humid").innerHTML = "Humidity: " + data.current.humidity + "%";
                            document.querySelector("#uvi").innerHTML = "UV-Index: " + uvSpan;
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
                                forecastIconEl.src = spliceInText(baseIconURL, 33, data.daily[i].weather[0].icon)
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
                                forecastTitleEl.classList.remove("d-none")
                                currentWeatherContainer.classList.remove("d-none")
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
}
//creates the span element as a text string
function uvSpanCreate(uvi) {
    span = "<span class=' p-1'></span>"
    if(uvi <= 2) {
        background = "bg-success"
    } else if (uvi > 2 && uvi < 6){
        background = "bg-warning"
    } else {
        background = "bg-danger"
    }

    uviSpan = spliceInText(span, 13, background)
    uviSpanComplete = spliceInText(uviSpan, (19 + background.length), uvi)
    return uviSpanComplete
}
//adds a text to a string 
function spliceInText(str, index, stringToAdd) {
return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}
//retrieves cities from local storage and adds to page
function onPageLoad() {
    storedCities = JSON.parse(localStorage.getItem("cities"));
    if(storedCities === null) {
        storedCities = []
    } else {
        historicalCities(storedCities)
    }
}
//event listener to handle clicks on the page where needed
$("#saved-city-list").on("click", "#citySaved-btn", saveCityBtnHandler )
$("#modal-city-display").on("click", "#city-btn", formCitySelectHandler)
userFormEl.addEventListener("submit", formSubmitHandler)
//runs when page loads to get search history 
onPageLoad()
