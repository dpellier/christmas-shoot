
Crafty.scene('Game', function() {
    Game.reset();
    Game.currentScene = 'Game';

    Crafty.background('url("assets/game.jpg") no-repeat');
    Crafty.e('Score');

    /**
     * Edge generation
     */
    for (var x = 0; x < Game.mainGrid.width; x++) {
        Crafty.e('Edge').at(x, 0);
        Crafty.e('Edge').at(x, Game.playgroundHeight() + 2.5);
    }

    for (var y = 0; y < Game.mainGrid.height; y++) {
        Crafty.e('Edge').at(0, y);
        Crafty.e('Edge').at(Game.mainGrid.width, y);
    }

    /**
     * Clouds generation
     */
//    var generateCloud = function() {
//        if (Game.currentScene === 'Game') {
//            var cloud = Crafty.e('Cloud').at(Game.mainGrid.width, randomFromInterval(0, Game.playgroundHeight()));
//            cloud.scroll(1 + Math.random(), generateCloud);
//        }
//    };
//
//    var maxCloud = 4;
//    for (var i = 0; i < maxCloud; i++) {
//        generateCloud();
//    }

    /**
     * Storms generation
     */
    var generateStorm = function() {
        if (Game.currentScene === 'Game') {
            var storm = Crafty.e('Storm').at(Game.mainGrid.width, randomFromInterval(0, Game.playgroundHeight()));
            storm.scroll(1 + Math.random(), generateStorm);
        }
    };

    for (var i = 0; i < Game.level.nbStorm; i++) {
        generateStorm();
    }


    /**
     * Houses generation
     */
    var generateHouse = function() {
        if (Game.currentScene === 'Game') {
            var house = Crafty.e('House').at(Game.mainGrid.width, 17.2);
            house.scroll(1, generateHouse);
        }
    };

    for (var i = 0; i < Game.level.nbHouse; i++) {
        generateHouse();
    }


    /**
     * Player creation
     */
    Game.player = Crafty.e('Santa').at(1, 4);

    Game.player.requires('Keyboard').bind('KeyDown', function () {
        if (this.isDown('SPACE')) {
            Game.player.shoot();
        }
    });

    /**
     * Level binding
     */
    this.uniqueBind('LevelUp', function() {
        for (var i = Crafty('Storm').length; i < Game.level.nbStorm; i++) {
            generateStorm();
        }

        for (var i = Crafty('House').length; i < Game.level.nbHouse; i++) {
            generateHouse();
        }
    });
}, function() {
    this.unbind('LevelUp');
});


Crafty.scene('GameOver', function() {
    Game.currentScene = 'GameOver';
    Crafty.background('rgb(0, 0, 0)');

    Crafty.e('DeadSanta').at(Game.player.x / Game.mainGrid.tile.width, Game.player.y / Game.mainGrid.tile.height);
    Crafty.e('FinalScore').at(0, Game.playgroundHeight() + 6);

    setTimeout(function() {
        Crafty.e('Retry').at(0, Game.playgroundHeight() + 8);
    }, 1000);

    // TODO Share it
    Crafty.e('Twitter').at(20, Game.playgroundHeight() + 6);
    Crafty.e('Google').at(23, Game.playgroundHeight() + 6);
    Crafty.e('Facebook').at(26, Game.playgroundHeight() + 6);
});


Crafty.scene('Start', function() {
    Game.currentScene = 'Start';
    var self = this;

    self.startGame = function() {
        Crafty.scene('Game');
    };

    Crafty.load(['assets/cloud.png',
                 'assets/game.jpg',
                 'assets/retry',
                 'assets/santa_dead.png',
                 'assets/sfeir.png',
                 'assets/sprite_house.png',
                 'assets/sprite_santa.png',
                 'assets/sprite_share.png',
                 'assets/sprite_storm.png',
                 'assets/start_button.png'], function() {

        Crafty.sprite(30, 'assets/cloud.png', {
            sprite_cloud: [0, 0]
        });

        Crafty.sprite(91, 31, 'assets/retry.png', {
            sprite_retry: [0, 0]
        });

        Crafty.sprite(132, 61, 'assets/santa_dead.png', {
            sprite_santa_dead: [0, 0]
        });

        Crafty.sprite(30, 26, 'assets/sfeir.png', {
            sprite_sfeir: [0, 0]
        });

        Crafty.sprite(80, 'assets/sprite_house.png', {
            sprite_house_1: [0, 0],
            sprite_house_2: [0, 1],
            sprite_house_3: [0, 2]
        });

        Crafty.sprite(80, 43, 'assets/sprite_santa.png', {
            sprite_santa: [0, 0]
        });

        Crafty.sprite(40, 'assets/sprite_share.png', {
            sprite_twitter: [0, 0],
            sprite_google: [1, 0],
            sprite_facebook: [2, 0]
        });

        Crafty.sprite(32, 27, 'assets/sprite_storm.png', {
            sprite_storm: [0, 0]
        });

        Crafty.sprite(79, 'assets/start_button.png', {
            sprite_start_button: [0, 0]
        });

        Crafty.e('StartButton').at(13.5, 16).uniqueBind('Click', self.startGame);
    });
});