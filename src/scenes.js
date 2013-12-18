
Crafty.scene('Game', function() {
    Game.reset();
    Game.currentScene = 'Game';

    Crafty.background('url("assets/game.jpg") no-repeat');
    Crafty.e('Score');

    /**
     * Edge generation
     */
    for (var x = 0; x < Game.mainGrid.width; x++) {
        Crafty.e('EdgeX').at(x, 0);
        Crafty.e('EdgeX').at(x, Game.playgroundHeight() + 2.5);
    }

    for (var y = 0; y < Game.mainGrid.height; y++) {
        Crafty.e('EdgeY').at(0, y);
        Crafty.e('EdgeY').at(Game.mainGrid.width, y);
    }

    /**
     * Storms generation
     */
    var generateStorm = function() {
        var storm = Crafty.e('Storm').at(Game.mainGrid.width, randomFromInterval(0, Game.playgroundHeight()));
        storm.scroll(1 + Math.random(), 'Game', generateStorm);
    };

    for (var i = 0; i < Game.level.nbStorm; i++) {
        generateStorm();
    }

    /**
     * Houses generation
     */
    // Get all possible starting position
    var position = new Array();
    for (var i = 0; i < Game.maxNbHouse; i++) {
        position.push(i * 80);
    }

    var generateHouse = function() {
        var xPos = position.slice();

        for (var i = 0; i < Game.level.nbHouse; i++) {
            var house = Crafty.e('House');
            house.y = 17.2 * Game.mainGrid.tile.height;

            // First house carry the callback to redraw all on the end of the screen
            if (i === 0) {
                house.x = Game.width();
                house.scroll(1, 'Game', generateHouse);
            } else {
                house.x = Game.width() + Number(xPos.splice(randomFromInterval(1, position.length - 1), 1));
                house.scroll(1, 'Game');
            }
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
     * Audio playing
     */
    var sound = Crafty.e('Sound').at(Game.mainGrid.width - 2, 0);
    if (Crafty.audio.supports('mp3')) {
        Crafty.audio.play('audio_game', -1);
    }

    /**
     * Level binding
     */
    this.uniqueBind('LevelUp', function() {
        for (var i = Crafty('Storm').length; i < Game.level.nbStorm; i++) {
            generateStorm();
        }
    });

    this.uniqueBind('KeyUp', function(e) {
        if (e.key === Crafty.keys['M']) {
            sound.toggleSound();
        }
    });
}, function() {
    Crafty.audio.stop('audio_game');
    this.unbind('LevelUp');
    this.unbind('KeyUp');
});


Crafty.scene('GameOver', function() {
    Game.currentScene = 'GameOver';
    var self = this;

    Crafty.background('rgb(0, 0, 0)');

    Crafty.e('DeadSanta').at(Game.player.x / Game.mainGrid.tile.width, Game.player.y / Game.mainGrid.tile.height);
    Crafty.e('FinalScore').at(2, Game.playgroundHeight() + 6);

    if (Crafty.audio.supports('mp3')) {
        Crafty.audio.play('audio_end');
    }

    setTimeout(function() {
        Crafty.e('Retry').at(20, Game.playgroundHeight() + 5.5);

        self.bind('KeyUp', function(e) {
            if (e.key === Crafty.keys['SPACE']) {
                Crafty.scene('Game');
            }
        });
    }, 1000);
}, function() {
    this.unbind('KeyUp');
});


Crafty.scene('Start', function() {
    Game.currentScene = 'Start';
    var self = this;

    Crafty.load(['assets/end.mp3',
                 'assets/jingle_bells.mp3',
                 'assets/game.jpg',
                 'assets/retry',
                 'assets/santa_dead.png',
                 'assets/sfeir.png',
                 'assets/sprite_house.png',
                 'assets/sprite_santa.png',
                 'assets/sprite_sound.png',
                 'assets/sprite_storm.png'], function() {

        Crafty.audio.add({
            audio_end: ['assets/end.mp3'],
            audio_game: ['assets/jingle_bells.mp3']
        });

        Crafty.sprite(160, 39, 'assets/retry.png', {
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

        Crafty.sprite(32, 'assets/sprite_sound.png', {
            sprite_sound: [0, 0]
        });

        Crafty.sprite(32, 27, 'assets/sprite_storm.png', {
            sprite_storm: [0, 0]
        });

        self.bind('KeyUp', function(e) {
            if (e.key === Crafty.keys['SPACE']) {
                Crafty.scene('Game');
            }
        });
    });
}, function() {
    this.unbind('KeyUp');
});