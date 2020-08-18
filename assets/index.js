// Search Menu Vars
let userInput = "";
let forecastData = [];
let searchedItems = [];
const menu = $('#menu') // Side Bar
const searchBar = $('#search-bar');
const searchButton = $('#search-button');
const searchHistory = $("#search-history");
const searchHistoryLabel = $('#search-history-label');
const clearHistoryButton = $('#clear-history-button');
// Data Display Vars
const weatherDisplay = $('#current-weather');
const weatherLocation = $('#location');
const forecastDisplay = $('#forecast');


// DOM Start
$(document).ready(function () {
    loadHistory();
    searchClickEvent();
    historyClickEvent();
    clearClickEvent();
})

// Click Events
function searchClickEvent() { // Click button to search
    searchButton.on("click", function () {
        event.preventDefault();
        if (searchBar.val() !== '') {
            userInput = searchBar.val();
            document.getElementById("search").reset()
            // NEED TO VALIDATE INPUT BEFORE SUBMISSION
            currentWeather(userInput); // Retreive data from OpenWeatherAPI
            currentForecast(userInput); // Retreive data from OpenWeather API
        }
        else {
            alert("Please don't submit nothing!"); // PLAY WITH LABELS/MODALS INSTEAD OF ALERTS
            return;
        }
    })
}

function historyClickEvent() { // CLick button in aside to search previous lookup
    $('.history-button').on("click", function () {
        event.preventDefault();
        userInput = this.value;
        currentWeather(userInput);
        currentForecast(userInput);
    })
}

function clearClickEvent() { // Clear Search History, Hide Search Label, Data Display
    clearHistoryButton.on("click", function () {
        localStorage.removeItem("userHistory");
        resetDisplay();
        location.reload();
    });
}

function resetDisplay() { // Clears information in display
    while (weatherDisplay.firstChild) {
        weatherDisplay.empty();
        forecastDisplay.empty();
    }
}

// Get and Display Data from OpenWeather API
function currentWeather() {// Pass in userInput from Search/History to Open Weather API for current weather data response
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${accesstoken}`;
    saveSearch(userInput); // Record search and update history
    // Clear data display
    resetDisplay();
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        // Grab and store currentWeather Data
        const today = new Date();
        const date = (today.getMonth() + 1) + '/' + (today.getDate()) + '/' + (today.getFullYear());
        const city = response.name;
        const icon = response.weather[0].icon;
        const iconURL = `http://openweathermap.org/img/w/${icon}.png`;
        const temperature = "Temperature: " + response.main.temp + " F";
        const humidity = "Humidity: " + response.main.humidity + "%";
        const windspeed = "Wind Speed: " + response.wind.speed + " MPH";
        const coords = [response.coord.lon, response.coord.lat];
        // Display Current Weather Data
        weatherDisplay.append($(`<h1>${city} ${date} <img src="${iconURL}"${icon}/></h1>`));
        weatherDisplay.append($(`<h6>${temperature}</h6>`));
        weatherDisplay.append($(`<h6>${humidity}</h6>`));
        weatherDisplay.append($(`<h6>${windspeed}</h6>`));
        getUVIndex(coords);
    })
}


function currentForecast() {// Pass in userInput from Search/History to Open Weather API for current forecast data response
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=imperial&appid=${accesstoken}`;
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        for (let i = 0; i < response.list.length; i++) {
            // only look at forecasts around 3:00pm
            if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                //5 day forecast @ 3pm
                const icon = response.list[i].weather[0].icon;
                const iconURL = `http://openweathermap.org/img/w/${icon}.png`;
                const iconIMG = $(`<img src="${iconURL}"${icon}/>`)
                const date = moment(response.list[i].dt_txt.substring(0, 10)).format('L');
                const temp = response.list[i].main.temp;
                const humidity = response.list[i].main.humidity;
                const forecast = {
                    date: date,
                    icon: iconIMG,
                    temp: temp,
                    humidity: humidity,
                }
                forecastDisplay.append($(`<div class="forecast-card" id="${response.list[i].dt_txt}"></div>`));
                let test = $(`#${response.list[i].dt_txt}`);
                Object.values(forecast).forEach(key => test.append($(`<h6>${key}</h6>`)));
            }
        }

    })
}

// UV Index Functions
function getUVIndex(coords) { // Get UVIndex data from OpenWeather API
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${accesstoken}&lat=${coords[0]}&lon=${coords[1]}`;
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        const uvIndex = response.value;
        displayUVIndex(uvIndex);
    })
}

function displayUVIndex(uvIndex) { // Display UVIndex in currentWeather and attach specific styling based on value
    const uvlabel = "UV Index: ";
    if (uvIndex < 3) {
        weatherDisplay.append($(`<h6>${uvlabel}<span class="uv-low" id="uvindex">${uvIndex}</span></h6>`));
    }
    else if (uvIndex > 3 && uvIndex < 6) {
        weatherDisplay.append($(`<h6>${uvlabel}<span class="uv-med" id="uvindex">${uvIndex}</span></h6>`));
    }
    else {
        weatherDisplay.append($(`<h6>${uvlabel}<span class="uv-high" id="uvindex">${uvIndex}</span></h6>`));
    }
}

// Search History Functions
function loadHistory() { // Load local storage search results
    if (localStorage.userHistory) {
        $('#history').removeClass("hidden");
        clearHistoryButton.removeClass("hidden");
        searchedItems = JSON.parse(localStorage.userHistory);
        searchedItems.forEach(function (userInput) {
            searchHistory.append($(`<button type="submit" class="history-button" value="${userInput}">${userInput}</button>`));
        })
        // let lastSearch = searchedItems.shift();
        // currentWeather(lastSearch);
    }
}

function saveSearch() { // Save search event and reveal history and data display
    $(".hidden").removeClass("hidden");
    if (searchedItems.length < 5) searchedItems.unshift(userInput);
    else {
        searchedItems.pop();
        searchedItems.unshift(userInput);
        searchHistory.children().last().remove()
    }
    localStorage.setItem("userHistory", JSON.stringify(searchedItems));
    createButton(userInput);
}

function createButton() { // Create button from input and append to history
    searchHistory.prepend($(`<button type="submit" class="history-button" value="${userInput}">${userInput}</button>`));
}

