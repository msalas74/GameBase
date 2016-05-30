window.onload = function () {

    var game = new Phaser.Game(450, 600, Phaser.AUTO, 'game-canvas');
    
    
    game.state.add('Game', GameState, true);

};














