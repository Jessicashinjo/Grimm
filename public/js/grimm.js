var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'main')
var stateTestmap = {preload: preload, create: create,update: update, render: render};
game.state.add('stateTestmap', stateTestmap);
game.state.start('stateTestmap');



function preload() {
  game.load.tilemap('basic_map', 'assets/maps/grimm_level1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tileset', 'assets/tilesets/sheetbw.png');
  game.load.image('tileset2', 'assets/tilesets/nautical_tilesheetbw.png');
  game.load.image('tileset3', 'assets/tilesets/spikes.png');
  game.load.image('background', 'assets/tilesets/bg_shroom.png');
  game.load.spritesheet('ninja', 'assets/sprites/ninja.png', 50, 50);
  game.load.spritesheet('coinSprite', 'assets/sprites/coin.png', 25, 25);

}

var map
var bg;
var p;
var jumpTimer = 0;
var cursors;
var jumpButton;
var ground;
var danger;
var spikes;
var coinGroup;

function create() {
  //  Enable Arcade physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0, 0, 1000, 500);
  createLevel1()


  //  Un-comment this on to see the collision tiles
  // ground.debug = true;

  //COLLISION
  map.setCollisionBetween(1, 100000, true, 'platform');
  map.setCollisionBetween(1, 100000, true, 'dangerZone');

  game.physics.arcade.gravity.y = 350;

  //  Here we create our coins group
  coinsGroup = game.add.group();
  coinsGroup.enableBody = true;

  //  And now we convert all of the Tiled objects with an ID of 1476 into sprites within the coins group
  map.createFromObjects('coins', 1476, 'coinSprite', 0, true, false, coinsGroup);

  //  Add animations to all of the coin sprites
  coinsGroup.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3], 10, true);
  coinsGroup.callAll('animations.play', 'animations', 'spin');


  //  Add a sprite
  p = game.add.sprite(100, 300, 'ninja');

  playerRun();

  //  Enable if for physics. This creates a default rectangular body.
  game.physics.arcade.enable(p);

  p.body.setSize(28, 34, 8, 13);
  // game.physics.arcade.setBoundsToWorld(true, true, true, false, false);
  p.body.collideWorldBounds = true;;

  p.body.fixedRotation = true;
  p.body.damping = 0.5;

  camera();
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}


function update() {
    game.physics.arcade.collide(p, ground);
    game.physics.arcade.collide(p, danger, playerDeath);
    // game.physics.arcade.collide(ground, coinGroup);
    game.physics.arcade.collide(coinGroup, ground);
    game.physics.arcade.overlap(p, coinsGroup, collectCoin, null, this);

  p.body.velocity.x = 0;

    /* actual movement */
  if (cursors.left.isDown) {
    p.body.velocity.x = -250;
    p.animations.play('left');
  } else if (cursors.right.isDown) {
    p.body.velocity.x = 250;
    p.animations.play('right');
  } else {
    p.frame = 16;
  }

  if (cursors.up.isDown && p.body.onFloor() && game.time.now > jumpTimer) {
      p.body.velocity.y = -300;
      jumpTimer = game.time.now + 750;
  }

}

function render() {

    game.debug.body(p);
    game.debug.bodyInfo(p, 32, 320);

}

function camera() {
  background.fixedToCamera = true;
  game.camera.follow(p);
}

function playerRun() {
  p.animations.add('left', [22, 23, 24, 25, 26], 14, true);
  p.animations.add('right', [16, 17, 18, 19, 20, 21], 14, true);
}

function createLevel1() {
  background = game.add.tileSprite(0, 0, 1000, 500, 'background');
  map = game.add.tilemap('basic_map');
  map.addTilesetImage('sheetbw', 'tileset');
  map.addTilesetImage('nautical_tilesheetbw', 'tileset2');
  map.addTilesetImage('spikes', 'tileset3');

  map.setCollisionByExclusion([1]);
  map.createLayer('background');
  danger = map.createLayer('dangerZone');
  ground = map.createLayer('platform');
  // health = map.createLayer('health');

  ground.resizeWorld();
}

function collectCoin(p, coin) {

    coin.kill();

}

function playerDeath() {
  // restartGame();
  // player.animations.play('damage');
  // explosionSound.play();
  // enemy.body.x = -200000;
  p.body.y -= 75;
  p.kill();
  restartGame();
  // --hitCount;
  // healthText.text = 'Health: ' + hitCount;
}

function restartGame() {
    // Start the 'stateTestmap' state, which restarts the game
    // StateManager.destroy('stateTestmap');
    // game.state.clear('stateTestmap')
    game.state.start('stateTestmap');
}
