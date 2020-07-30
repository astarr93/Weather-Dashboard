// Global Variables
let userInput = "";
let searchedItems = [];
const searchBar = $('#search-bar')
const searchButton = $('#search-button')
const searchHistory = $('#searh-history')

// Start on DOM ready
$(document).ready(function () {
    searchClickEvent();
    displayHistory();
})

function searchClickEvent() {
    searchButton.on("click", function () {
        event.preventDefault();
        userInput = searchBar.val();
        recordSearch(userInput);
        // weatherLookup(userInput);
    })
}

function recordSearch() {
    searchedItems.push(userInput);
    localStorage.setItem("Search History", searchedItems);
    displayHistory(searchedItems);
}

function displayHistory() {
    if (localStorage.getItem("Search History")) {
        searchHistory.append($('<ul class="list-style" id="searchedItems">'));
        localStorage.getItem("Search History").forEach(item => {

        });
    }
}

function weatherLookup() {
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${accesstoken}`;
    console.log(queryURL);
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        data = JSON.stringify(response);
        console.log(data);
    })
}