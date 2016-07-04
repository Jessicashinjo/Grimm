grimm
  .config(() => (
    firebase.initializeApp({
      apiKey: 'AIzaSyCI5fY2pyhcTSQKAOFwv7XEz7kMhmV8x8U',
      authDomain: 'grimm-6edf6.firebaseapp.com',
      databaseURL: 'https://grimm-6edf6.firebaseio.com',
      storageBucket: 'grimm-6edf6.appspot.com'
    })
  ))
  .config(($routeProvider) => {
    $routeProvider
    .when('/menu', {
      templateUrl: 'app/partials/menu.html',
      controller: 'MenuCtrl',
      controllerAs: 'menu'
    })
    .when('/grimm', {
      templateUrl: 'app/partials/grimm.html',
      controller: 'GameCtrl',
      controllerAs: 'game'
    })
    .when('/stats', {
      templateUrl: 'app/partials/stats.html',
      controller: 'StatsCtrl',
      controllerAs: 'stats'
    })
    .otherwise('/menu');
  });
