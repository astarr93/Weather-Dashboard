// Global Variables
let userInput = "";
let searchedItems = [];
const searchBar = $('#search-bar')
const searchButton = $('#search-button')
const searchHistory = $('#search-history')

// Start on DOM ready
$(document).ready(function () {
    searchClickEvent();
    if (localStorage.userHistory) {
        JSON.parse(localStorage.userHistory).forEach(function (record) {
            searchedItems.push(record);
        })
        console.log(searchedItems);
        displayHistory(searchedItems);
    }
})

function searchClickEvent() {
    searchButton.on("click", function () {
        event.preventDefault();
        if (searchBar.val() !== '') {
            userInput = searchBar.val();
            startLookup(userInput); // Retreive data from OpenWeatherAPI
            recordLookup(userInput);  // Record search and update history
        }
        else {
            alert("You suck!");
            return;
        }
    })
}


// Pass in userInput to Open Weather API, response is weather data
async function startLookup() {
    const accesstoken = "bf9f438089a6bdeedce9b06784b29a58";
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${accesstoken}`;
    console.log(queryURL);
    await $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        data = JSON.stringify(response);
        console.log(data);
    })
}

function recordLookup() {
    searchedItems.push(userInput);
    localStorage.setItem("userHistory", JSON.stringify(searchedItems));

}

function displayHistory() {
    searchHistory.append($('<p id="menu-header">History:</p>'));
    // let city = JSON.parse(searchedItems);
    searchedItems.forEach(function (item) {
        searchHistory.append($(`<button class="history-button">${searchedItems.item}</button>`));
    })
}
// searchedItems.forEach(function (item) {
//     searchHistory.append($(`<button class="history-button">${searchedItems}</button>`));
// })