# Plan for beautiful weather with this simple weather dashboard!

Try it out: https://astarr93.github.io/weather-dashboard/

![image](https://user-images.githubusercontent.com/47404581/90602934-7d4b0a00-e1c8-11ea-9fbe-6ea8fe1df23a.png)

This weather dashboard is powered using a free OpenWeatherAPI key with asynchronous javascript calls to retreve and display current weather, forecast and ultra-violet (UV) index data for a user-specified US city. Built using HTML, CSS, JavaScript languages with Bootstrap, jQuery, and Moment.js libraries.

# How do I use the app?

Use the Search Bar on the left to search for a US city. Current weather information will automatically be displayed in the main portion of the page. Forecast cards will appear directly below the current data with the next 5-days laid out from right=to-left. Click on the clear button to delete your search history and reload the app.

User history is saved to the browser's local storage and a button will appear below the search bar. Every search is saved and creates a history button that can be used to return to that location's results. After 5 searches, the list will automatically remove the oldest search.
