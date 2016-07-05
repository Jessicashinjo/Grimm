angular.module('grimm')
  .controller('StatsCtrl', function (statsFactory) {
    // console.log('stats Controller')
    const stats = this;
    stats.leaderboardData = null;
    statsFactory.getLeaderboard()
      .then( (response) => {
        stats.leaderboardData = response.data;
        console.log('controller data', stats.leaderboardData);
      });
  });

  // .then( (response) => {
  //   leaderboard = response.data;
  //   for(var user in leaderboard){
  //     stats[stats.length] = leaderboard[user];
  //   }
  //   console.log('response', stats);
  // });
