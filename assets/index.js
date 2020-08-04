// Global Variables
let userInput = "";
let searchedItems = [];
const searchBar = $('#search-bar')
const searchButton = $('#search-button')
const searchHistory = document.getElementById("search-history");
const searchHistoryLabel = $('#search-history-label')
const menu = $('#menu')

// Start on DOM ready
$(document).ready(function () {
    displayHistory();
    searchClickEvent();
}
)

function searchClickEvent() {
    searchButton.on("click", function () {
        event.preventDefault();
        if (searchBar.val() !== '') {
            userInput = searchBar.val();
            document.getElementById("search").reset()
            // NEED TO VALIDATE INPUT BEFORE SUBMISSION
            startLookup(userInput); // Retreive data from OpenWeatherAPI
        }
        else {
            alert("You suck!"); // PLAY WITH LABELS INSTEAD OF ALERTS
            return;
        }
    })
}


// Pass in userInput to Open Weather API, response is weather data
async function startLookup() {
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${accesstoken}`;
    recordLookup(userInput); // Record search and update history
    await $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        data = JSON.stringify(response);
        // console.log(data);
    })
}

// Search History Functions

function displayHistory() {
    if (localStorage.userHistory) {
        $('#search-history-label').removeClass("hidden");
        searchedItems = JSON.parse(localStorage.userHistory);
        searchedItems.forEach(function (item) {
            $('#search-history').append($(`<button class="history-button">${item}</button>`));
        })
    }
}

function recordLookup() {
    if (searchedItems.length > 10) {
        searchedItems.pop();
        searchedItems.unshift(userInput);
        localStorage.setItem("userHistory", JSON.stringify(searchedItems));
        manageHistory(userInput);
    }
    else {
        searchedItems.unshift(userInput);
        localStorage.setItem("userHistory", JSON.stringify(searchedItems));
        manageHistory(userInput);
    }
}

function manageHistory() {
    if (searchedItems.length > 10) {
        $('#search-history').children().last().remove();
        createButton(userInput);
    }
    else {
        createButton(userInput);
    }
}

function createButton() {
    $('#search-history').prepend($(`<button class="history-button">${userInput}</button>`)); // Review Button Classes for CSS
}