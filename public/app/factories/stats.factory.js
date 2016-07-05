grimm
  .factory('statsFactory', ($http, firebaseURL) => {
    // let stats = [];

    return {
      getLeaderboard() {
        let stats = [];
        let leaderboard = null;
        return $http
          .get(`${firebaseURL}/leaderboard.json`)
      },
      setNewStat (){
        // $http
        //   .post(`${firebaseURL}/leaderboard/${userStat}`);
      }
    };

  });
