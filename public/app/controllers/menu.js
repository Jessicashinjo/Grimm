grimm
  .controller('MenuCtrl', function ($scope, $location) {

  $scope.go = function ( path ) {
    $location.path( path );
  };

})
