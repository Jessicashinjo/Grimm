"use strict";

grimm
  .controller('LoginCtrl', function($scope, $location, firebaseURL, AuthFactory){

    let ref = firebaseURL;

    $scope.hasUser = false;


    //delete after demo
    $scope.go = function ( path ) {
      $location.path( path );
    };

    // --- Clears the input fields when the controller loads --- //
    $scope.account = {
      email: "",
      password: ""
    };

    if($location.path() === "/logout"){
      ref.unauth();   // Firebase method that kills your "authenticated" token for that session
    };

    $scope.register = () => {

      ref.createUser({
        email: $scope.account.email,
        password: $scope.account.password
      }, (error, userData) => {    // anonymous function with two inputs, error and returned data object
        if(error){
          console.log(`Error creating user: ${error}`)
        } else {
          $scope.login();
        }
      })
    };

    $scope.login = () => {
      AuthFactory
        .authenticate($scope.account)
        .then(() => {
          $scope.hasUser = true;
          $location.path("/");
          $scope.$apply();       // --- Angular version of some JavaScript magic ( .apply() )
        })
    };



  });
