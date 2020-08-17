// Search Menu Vars
let userInput = "";
let uvindex = 0;
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
            // currentForecast(userInput);
        }
        else {
            alert("You suck!"); // PLAY WITH LABELS INSTEAD OF ALERTS
            return;
        }
    })
}

function historyClickEvent() { // CLick button in aside to search previous lookup
    $('.history-button').on("click", function () {
        event.preventDefault();
        userInput = this.value;
        currentWeather(userInput);
        // currentForecast(userInput);
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
    let display = document.getElementById('current-weather');
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
}



// Pass in userInput from Search/History to Open Weather API for current weather data response
function currentWeather() {
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${accesstoken}`;
    saveSearch(userInput); // Record search and update history
    currentForecast(userInput); // Grab forecast
    // Clear data display
    resetDisplay();
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        // Grab and store currentWeather Data
        let today = new Date();
        let date = (today.getMonth() + 1) + '/' + (today.getDate()) + '/' + (today.getFullYear());
        let city = response.name;
        let icon = response.weather[0].icon;
        let iconURL = `http://openweathermap.org/img/w/${icon}.png`;
        let temperature = "Temperature: " + response.main.temp + " F";
        let humidity = "Humidity: " + response.main.humidity + "%";
        let windspeed = "Wind Speed: " + response.wind.speed + " MPH";
        let coords = [response.coord.lon, response.coord.lat];
        getUVIndex(coords);
        // Display Current Weather Data
        weatherDisplay.append($(`<h1>${city} ${date} <img src="${iconURL}"${icon}/></h1>`));
        weatherDisplay.append($(`<h6>${temperature}</h6>`));
        weatherDisplay.append($(`<h6>${humidity}</h6>`));
        weatherDisplay.append($(`<h6>${windspeed}</h6>`));
        displayUVIndex(uvindex);
    })
}

function currentForecast() {
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=imperial&appid=${accesstoken}`;
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        console.log(response);
    })
}

function getUVIndex(coords) {
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${accesstoken}&lat=${coords[0]}&lon=${coords[1]}`;
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        uvindex = response.value;
    })
}

function displayUVIndex(uvindex) {
    if (uvindex < 3) {
        weatherDisplay.append($(`<h6 class="uv-low" id="uvindex">UV Index: ${uvindex}</h6>`));
    }
    else if (uvindex > 3 && uvindex < 6) {
        weatherDisplay.append($(`<h6 class="uv-med" id="uvindex">UV Index: ${uvindex}</h6>`));
    }
    else {
        weatherDisplay.append($(`<h6 class="uv-high" id="uvindex">UV Index: ${uvindex}</h6>`));
    }
}


// Search History Functions
function loadHistory() { // Load local storage search results
    if (localStorage.userHistory) {
        $('#menu-header').removeClass("hidden");
        clearHistoryButton.removeClass("hidden");
        searchedItems = JSON.parse(localStorage.userHistory);
        searchedItems.forEach(function (userInput) {
            searchHistory.append($(`<button type="submit" class="history-button" value="${userInput}">${userInput}</button>`));
        })
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

