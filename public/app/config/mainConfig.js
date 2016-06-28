grimm
  .config(() => (
    firebase.initializeApp({
      apiKey: "AIzaSyCI5fY2pyhcTSQKAOFwv7XEz7kMhmV8x8U",
      authDomain: "grimm-6edf6.firebaseapp.com",
      databaseURL: "https://grimm-6edf6.firebaseio.com",
      storageBucket: "grimm-6edf6.appspot.com",
    })
  ))
  .config(($routeProvider) => {
  $routeProvider
    // .when('/', {
    //   templateUrl: 'index.html'
    // })
    .when('/login', {
      templateUrl: 'app/partials/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
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
    // .when('/hello/:name', {
    //   templateUrl: 'app/partials/hello-person.html',
    //   controller: 'HelloPersonCtrl',
    //   controllerAs: 'helloPerson',
    // })
    .otherwise('/login')
})
