// Global Variables
let userInput = "";
let searchedItems = [];
const searchBar = $('#search-bar')
const searchButton = $('#search-button')
const searchHistory = $("#search-history");
const searchHistoryLabel = $('#search-history-label')
const clearHistoryButton = $('#clear-history-button');
const menu = $('#menu')

// Start on DOM ready
$(document).ready(function () {
    loadHistory();
    searchClickEvent();
    clearClickEvent();
}
)


// Click Events

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

function clearClickEvent() { // Clear Search History, Hide Search Label, Data Display
    clearHistoryButton.on("click", function () {
        localStorage.removeItem("userHistory");
        location.reload();
    })
};

// Pass in userInput to Open Weather API, response is weather data
async function startLookup() {
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${accesstoken}`;
    saveSearch(userInput); // Record search and update history
    await $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        data = JSON.stringify(response);
        // console.log(data);
    })
}

// Search History Functions

function loadHistory() { // Load local storage search results
    if (localStorage.userHistory) {
        $('.hidden').removeClass("hidden");
        searchedItems = JSON.parse(localStorage.userHistory);
        searchedItems.forEach(function (item) {
            $('#search-history').append($(`<button class="history-button">${item}</button>`));
        })
    }
}

function saveSearch() {
    $(".hidden").removeClass("hidden");
    const saveSearch = (searchedItems.length > 3) ? searchedItems.pop() && searchedItems.unshift(userInput) : searchedItems.unshift(userInput);
    localStorage.setItem("userHistory", JSON.stringify(searchedItems));
    const updateDisplay = (searchedItems.length > 3) ? searchHistory.children().last().remove() && createButton(userInput) : createButton(userInput);
}

function createButton() { // Create button from input and append to history
    searchHistory.prepend($(`<button class="history-button">${userInput}</button>`));
}