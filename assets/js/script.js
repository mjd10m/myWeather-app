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
                var weatherApiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly,daily,minutely,alerts&units=imperial&appid=" + apiKey;
                fetch(weatherApiURL).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            console.log(data);
                            console.log(data.current.temp);
                            console.log(data.current.wind_speed);
                            console.log(data.current.humidity);
                            console.log(data.current.uvi);
                            console.log(citySelected);
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



userFormEl.addEventListener("submit", formSubmitHandler)
