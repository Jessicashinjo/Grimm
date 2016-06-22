grimm
  .controller('GameCtrl', function (gameInit) {
    var game = gameInit;
    var lvl1 = {preload: preload, create: create,update: update, render: render};
    game.state.add('lvl1', lvl1);
    game.state.start('lvl1');



    function preload() {
      game.load.tilemap('basic_map', 'assets/maps/grimm_level1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tileset', 'assets/tilesets/sheetbw.png');
      game.load.image('tileset2', 'assets/tilesets/nautical_tilesheetbw.png');
      game.load.image('tileset3', 'assets/tilesets/spikes.png');
      game.load.image('background', 'assets/tilesets/bg_shroom.png');
      game.load.image('saw', 'assets/sprites/Obstacle-2/Obstacle-2_000.png');
      game.load.image('enemyBullet', 'assets/dye/enemyBullet.png');
      game.load.image('pBullet', 'assets/sprites/playerBullet.png');
      game.load.spritesheet('ninja', 'assets/sprites/ninja.png', 50, 50);
      game.load.spritesheet('coinSprite', 'assets/sprites/coin.png', 25, 25);
      game.load.spritesheet('gunSprite', 'assets/sprites/gunSprite.png', 70, 70);

      // game.load.spritesheet('maceSprite', 'assets/sprites/maceSprite.png', 330, 200);
    }

    var map
    var bg;
    var p;
    var jumpTimer = 0;
    var cursors;
    var ground;
    var danger;
    var spikes;
    var coinsGroup;
    var bullet;
    var bullets;
    var playerBullets;
    var playerBullet;
    var playerBulletTime = 0;
    var guns;
    var gunTime = 0;
    var score;
    var health = 1;
    var healthText;
    var scoreText;
    var right = 16;
    var left = 22;
    var facing;
    var shoot;
    // var maceGroup
    // var mace1 = {
    //     'x': [280, 384, 415, 514],
    //     'y': [187, 281, 281, 208]
    //   };

    function create() {
      //  Enable Arcade physics
      game.physics.startSystem(Phaser.Physics.ARCADE);
      score = 0;
      game.score = score;

      game.world.setBounds(0, 0, 1000, 500);
      createLevel1()


      //  Un-comment this on to see the collision tiles
      // ground.debug = true;

      //COLLISION
      map.setCollisionBetween(1, 2000, true, 'platform');
      map.setCollisionBetween(1, 2000, true, 'dangerZone');

      game.physics.arcade.gravity.y = 600;

      createCoinsGroup();

      createGunsGroup();

      createBullets();

      createPlayerBullets();
      /****************
      ****************/
      // maceGroup = game.add.group();
      // maceGroup.enableBody = true;
      // // game.physics.enable( [ maceGroup ], Phaser.Physics.ARCADE);
      //
      // //  And now we convert all of the Tiled objects with an ID of 1476 into sprites within the mace group
      // map.createFromObjects('dangerObjects', 1480, 'maceSprite', 0, true, false, maceGroup);
      //
      // maceGroup.forEach(function(mace){mace.body.allowGravity = false;  });
      //
      // //  Add animations to all of the coin sprites
      // maceGroup.callAll('animations.add', 'animations', 'swing', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
      // maceGroup.callAll('animations.play', 'animations', 'swing');

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
      shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      scoreText = game.add.text(20, 20, `Score: ${score}`, { fontSize: '32px', fill: '#FFF', align: 'right' });
      scoreText.fixedToCamera = true;


    }


    function update() {
        game.physics.arcade.collide(p, ground);
        game.physics.arcade.collide(p, danger, playerDeath);
        game.physics.arcade.collide(p, gunsGroup);
        game.physics.arcade.collide(coinsGroup, ground);
        game.physics.arcade.overlap(p, bullet, bulletKill, null, this);
        // game.physics.arcade.overlap(playerBullet, bullets, playerBulletKill, null, this);
        game.physics.arcade.overlap(playerBullet, bullets, enemyPlayerBulletKill, null, this);
        game.physics.arcade.overlap(p, coinsGroup, collectCoin, null, this);

        gunsGroup.forEach(function(gun){
          if(gun.body.x - p.body.x <= 400) {
            gunFire(gun);
          }
        });
        gunsGroup.forEachAlive(function(bullet){
          if(bullet.body.x - game.cameraLastX <= 0) {
            bullet.kill();
          }
        });

        playerBullets.forEachAlive(function(playerBullet){
          // var distanceFromPlayer = 600;
          if(Math.abs(p.x - playerBullet.x) >= 300) {
            playerBullet.kill();
          }
        }, this);


      p.body.velocity.x = 0;

        /* actual movement */
      if (cursors.left.isDown) {
        p.body.velocity.x = -250;
        p.animations.play('left');
        facing = left;
      } else if (cursors.right.isDown) {
        p.body.velocity.x = 250;
        p.animations.play('right');
        facing = right;
      } else if ( facing === left){
        p.frame = left;
      } else{
        p.frame = right;
      }

      /* Player Firing Shots*/
      if (shoot.isDown) {
        playerFire();
      }

      if (cursors.up.isDown && p.body.onFloor() && game.time.now > jumpTimer) {
          p.body.velocity.y = -350;
          jumpTimer = game.time.now + 500;
      }

      // if(game.camera.x !== game.cameraLastX){
      //   game.bg.x -= 0.4 * (game.cameraLastX - game.camera.x);
      //   game.cameraLastX = game.camera.x;
      // }

    }

    function render() {

        // game.debug.body(p);
        // game.debug.bodyInfo(p, 32, 320);
        // game.debug.body(bullets.children[0])

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

    function createCoinsGroup() {
      //  Here we create our coins group
      coinsGroup = game.add.group();
      coinsGroup.enableBody = true;

      //  And now we convert all of the Tiled objects with an ID of 1476 into sprites within the coins group
      map.createFromObjects('coins', 1476, 'coinSprite', 0, true, false, coinsGroup);

      //  Add animations to all of the coin sprites
      coinsGroup.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3], 8, true);
      coinsGroup.callAll('animations.play', 'animations', 'spin');
    }

    function collectCoin(p, coin) {
        coin.kill();
        score += 10;
        scoreText.text = `Score: ${score}`;
    }

    function createGunsGroup() {
      //  Here we create our guns group
      gunsGroup = game.add.group();
      gunsGroup.enableBody = true;

      //  And now we convert all of the Tiled objects with an ID of 1476 into sprites within the coins group
      map.createFromObjects('dangerObjects', 1502, 'gunSprite', 0, true, false, gunsGroup);

      gunsGroup.forEach(function(gun, index){
        gun.body.allowGravity = false;
        gun.gunTime = 0;
        gun.outOfBoundsKill = true;
        gun.checkWorldBounds = true;
      });


      //  Add animations to all of the gun sprites
      gunsGroup.callAll('animations.add', 'animations', 'fire', [2, 3], 2, true);
      gunsGroup.callAll('animations.play', 'animations', 'fire');
    }

    function createBullets () {
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.createMultiple(100, 'enemyBullet');
      bullets.forEach(function(bullet){
        bullet.allowGravity = false;
        bullet.body.setSize(20, 20);
      });
      // bullets.setAll('anchor.x', 0.5);
      // bullets.setAll('anchor.y', 0.5);
      bullets.setAll('outOfBoundsKill', true);
      bullets.setAll('checkWorldBounds', true);
    }
    function createPlayerBullets () {
      playerBullets = game.add.group();
      playerBullets.enableBody = true;
      playerBullets.createMultiple(10, 'pBullet');
      playerBullets.forEach(function(playerBullet){
        playerBullet.allowGravity = true;
        playerBullet.body.setSize(30, 12);
      });
      // bullets.setAll('anchor.x', 0.5);
      // bullets.setAll('anchor.y', 0.5);
      playerBullets.setAll('outOfBoundsKill', true);
      playerBullets.setAll('checkWorldBounds', true);
    }

    function bulletKill() {
      bullet.kill();
      losePoints();
    }

    function playerBulletKill() {
      playerBullet.kill();
    }

    function enemyPlayerBulletKill() {
      console.log('kill all the bullets');
      bullet.kill();
      playerBullet.kill();
    }

    function gunFire (gun) {
      // console.log('I am the gun', gun.x);
      if (game.time.now > gun.gunTime)
      {
        bullet = bullets.getFirstExists(false);
        if (bullet) {
          bullet.anchor.setTo(0.5, 0.5);
          bullet.reset(gun.body.x +5, gun.body.y +20);
          gun.gunTime = game.time.now + 2000;
          // bullet.body.velocity.x -100;
          // bullet.body.velocity.y +400;
          game.physics.arcade.moveToObject(bullet, p, 500);
        }
      }
    }

    function playerFire() {
     if (game.time.now > playerBulletTime  && facing === right) {
          playerBullet = playerBullets.getFirstExists(false);
          if (playerBullet) {
              playerBullet.reset(p.x , p.y + 20);
              playerBullet.body.velocity.x = 600;
              playerBulletTime = game.time.now + 750;
          }
      } else if (game.time.now > playerBulletTime && facing === left) {
          playerBullet = playerBullets.getFirstExists(false);

          if (playerBullet) {
              playerBullet.reset(p.x , p.y + 20);
              playerBullet.body.velocity.x = -600;
              playerBulletTime = game.time.now + 750;
          }
      }
    }

    function losePoints() {
      if ( Math.abs(score - 10) >= 0) {
        score -= score - 10;
      } else {
        playerDeath();
      }
    }

    function playerDeath() {
      // restartGame();
      // player.animations.play('damage');
      // explosionSound.play();
      // enemy.body.x = -200000;
      p.body.y -= 75;
      p.kill();
      restartGame();
      score = 0;
      // --hitCount;
      // healthText.text = 'Health: ' + hitCount;
    }

    function restartGame() {
        // Start the 'stateTestmap' state, which restarts the game
        // StateManager.destroy('stateTestmap');
        // game.state.clear('stateTestmap')
        game.state.start('stateTestmap');
    }
})
