(function() {
  'use strict';

  var app = {
    isLoading: true,

    selectedNothings: [],//app.selectedNOthings
    spinner: document.querySelector('.loader'),

    container: document.querySelector('.main'),

    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };//end object


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateNothing();
  });
  


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/
   //our only button that updates our nothing.
  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateNothing();
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  app.updateNothing = function(data) {

    console.log("updating nothing with data")
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */

  app.updateNothing = function() {

    console.log("refreshing Nothing");

  };

  // TODO add saveSelectedNothings function here

  //THE Injection of the local storage with fake data.
    // Save list of crap to localStorage.
    //localstorage is a simplified user preferences.

    //a module of the startup code.
  app.saveSelectedNothings = function() {
    var selectedNothings = JSON.stringify(app.selectedNothings);
    localStorage.selectedNothings = selectedNothings;
  };

  //this is our initial injection data.... could be messages...
  var initialNothing = {
    //this is the fake data obj
    key: '101',
    label: 'fuck'

  };
  // TODO uncomment line below to test app with fake data
  app.updateNothing(initialNothing);

  // TODO add startup code here
  //city???
  app.selectedNothings = localStorage.selectedNothings;
  if (app.selectedNothings) {
    app.selectedNothings = JSON.parse(app.selectedNothings);
    app.selectedNothings.forEach(function(nowhere) {

      //app.getNothing(nowhere.key, nowhere.label);

    });
  } else {
    /* The user is using the app for the first time, or the user has not
     * saved any cities, so show the user some fake data. A real app in this
     * scenario could guess the user's location via IP lookup and then inject
     * that data into the page.
     */
    app.updateNothing(initialNothing);
    app.selectedNothings = [
      {key: initialNothing.key, label: initialNothing.label}
    ];
    app.saveSelectedNothings();
  }//end conditional


  // TODO add service worker code here

  //When the service worker is registered, an install event is triggered the first time the user visits the page. 
  //In this event handler, we will cache all the assets that are needed for the application.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }//end if

})//end of function
();

