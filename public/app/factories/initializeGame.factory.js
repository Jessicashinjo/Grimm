angular.module("grimm")
.factory("gameInit", function() {
  console.log('game init factory loaded');
  var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'main');
  return game;
});
