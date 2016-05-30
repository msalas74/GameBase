
GameState.prototype.shootBullet = function () {
	// Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.

    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;

    //get dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();

    //if there aren't any dead bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;

    //revive the bullet
    //this makes the bullet "alive"
    bullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    bullet.reset(this.gun.x, this.gun.y);
    bullet.rotation = this.gun.rotation;

    // Shoot it in the right direction
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;

};


// The update() method is called every frame
GameState.prototype.update = function() {

    //check if bullets have collided with the ground
    this.game.physics.arcade.collide(this.bulletPool, this.ground, function (bullet, ground) {
        //create and explosion
        this.getExplosion(bullet.x, bullet.y);

        //kill bullet
        bullet.kill();
    }, null, this);

    //check if bullets have collided with the enemy
    this.game.physics.arcade.collide(this.bulletPool, this.enemyPool, function (bullet, enemy) {
        //create and explosion
        this.getExplosion(bullet.x, bullet.y);

        //kill bullet and enemy
        bullet.kill();
        enemy.kill();
    }, null, this);

    //check for collision with enemy and wall
    this.game.physics.arcade.collide(this.enemyPool, this.wall);


    // Aim the gun at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);

    // Shoot a bullet
    if (this.game.input.activePointer.isDown) {
        this.shootBullet();
    }
};


GameState.prototype.getExplosion = function (x, y) {
    //get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    //if ther aren't any available, create a new one
    if( explosion === null)
    {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        //add an animation that kills the sprite when the animation is complete
        var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
        animation.killOnComplete = true;

        //add explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    //move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

     // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;

};