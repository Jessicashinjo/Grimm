grimm
  .constant('API_URL', 'https://grimm-6edf6.firebaseio.com/')
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
