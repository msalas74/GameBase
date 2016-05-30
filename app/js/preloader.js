//load images and sounds
GameState.prototype.preload = function () {
	//bullets and player
	this.game.load.image('bullet', 'img/assets/gfx/bullet.png');

	//enemies
	this.game.load.image('enemy', 'img/assets/gfx/player.png');

	//world objects
	this.game.load.image('ground', 'img/assets/gfx/ground.png');

	//sfx and sprites
	this.game.load.spritesheet('explosion', 'img/assets/gfx/explosion.png', 128, 128);

};

//setup example
GameState.prototype.create = function () {
	//set stage background color
	this.game.stage.backgroundColor = '#4488cc';

	//constants
	this.SHOT_DELAY = 200; //milliseconds
	this.BULLET_SPEED = 700;  //pixels per second
	this.NUMBER_OF_BULLETS = 10;

	// Create some wall
    this.wall = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var wallBlock = this.game.add.sprite(x, this.game.height - 130, 'ground');
        this.game.physics.enable(wallBlock, Phaser.Physics.ARCADE);
        wallBlock.body.immovable = true;
        wallBlock.body.allowGravity = false;
        this.wall.add(wallBlock);
    }

	//create object represnting gun/player
	this.gun = this.game.add.sprite(this.game.width/2, this.game.height - 50, 'bullet');
	//set pivot point to center of gun/player
	this.gun.anchor.setTo(0.5, 0.5);


	//create an object pool of bullets/arrows
	this.bulletPool = this.game.add.group();
	
	for (var i = 1; i < this.NUMBER_OF_BULLETS; i++)
	{
		//create each bullet and add to group
		var bullet = this.game.add.sprite(0,0, 'bullet');
		this.bulletPool.add(bullet);

		//set pivot point to center of bullet
		bullet.anchor.setTo(0.5, 0.5);

		//enable physics on the bullet
		this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
		//set initial state to dead
		bullet.kill();
	}

	//simulate a pointer click to aim gun down the middle of canvas
	this.game.input.activePointer.x = this.game.width/2;
	this.game.input.activePointer.y = this.game.height/2;


	// Create some ground
    this.ground = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }

    

    //create explosion group
    this.explosionGroup = this.game.add.group();

    // Create a follower
    //this.game.add.existing(
    //    new Follower(this.game, this.game.width - 100, this.game.height/2, this.gun)
    //);

    //create enemy
		this.enemyPool = this.game.add.group();
		this.enemyPool.enableBody = true;

		//create 12 stars spaced evenly apart
		for (var i = 0; i < 7; i++)
		{
			var enemy = this.enemyPool.create(i * 70, 90, 'enemy');
			//enable physics on the enemy
			this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
			enemy.body.gravity.y = 60;
			//enemy.body.bounce.y = 0.7 + Math.random() * 0.2;
			// Calculate velocity vector based on rotation and this.MAX_SPEED
        	//enemy.velocity.x = Math.cos(rotation) * 10;
        	//enemy.velocity.y = Math.sin(rotation) * 10;
    
		}


};