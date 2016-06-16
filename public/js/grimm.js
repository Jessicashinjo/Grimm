var game = new Phaser.Game(700, 325, Phaser.CANVAS, 'main')
var stateTestmap = {preload: preload, create: create,update: update, render: render};
game.state.add('stateTestmap', stateTestmap);
game.state.start('stateTestmap');



function preload() {
  game.load.tilemap('basic_map', 'assets/maps/grimm_level1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tileset', 'assets/tilesets/Gimp_tilesheet2.png');
  game.load.image('background', 'assets/tilesets/bg.png');
  game.load.spritesheet('ninja', 'assets/sprites/ninja.png', 50, 50);

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

function create() {
  //  Enable Arcade physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0, 0, 700, 325);
  createLevel1()


  //  Un-comment this on to see the collision tiles
  // ground.debug = true;

  //COLLISION
  map.setCollisionBetween(1, 100000, true, 'DangerColl');
  map.setCollisionBetween(1, 100000, true, 'Ground');

  game.physics.arcade.gravity.y = 350;
  // game.physics.arcade.world.defaultContactMaterial.friction = 0.3;
  // game.physics.arcade.world.setGlobalStiffness(1e5);


  //  Add a sprite
  p = game.add.sprite(100, 50, 'ninja');

  playerRun();

  //  Enable if for physics. This creates a default rectangular body.
  game.physics.arcade.enable(p);

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
  background = game.add.tileSprite(0, 0, 700, 325, 'background');
  map = game.add.tilemap('basic_map');
  map.addTilesetImage('Gimp_tilesheet2', 'tileset');

  map.setCollisionByExclusion([1]);
  map.createLayer('Foliage');
  ground = map.createLayer('Ground');
  danger = map.createLayer('DangerColl');

  danger.resizeWorld();
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
