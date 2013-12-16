
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.mainGrid.tile.width,
            h: Game.mainGrid.tile.height
        });
    },

    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return {
                x: this.x / Game.mainGrid.tile.width,
                y: this.y / Game.mainGrid.tile.height
            };
        } else {
            this.attr({
                x: x * Game.mainGrid.tile.width,
                y: y * Game.mainGrid.tile.height
            });
            return this;
        }
    }
});

Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    }
});

Crafty.c('Button', {
    init: function() {
        this.requires('2D, DOM, Grid, Mouse')
            .css({cursor: 'pointer'});
    }
});

Crafty.c('Scrollable', {
    _speed: 2,

    scroll: function(direction, onDestroy) {
        var self = this;
        self.x -= self._speed * direction;

        if (self.x + self.w < Crafty.viewport.x) {
            self.destroy();
            if (onDestroy) {
                onDestroy.call(self);
            }
        } else {
            setTimeout(function() {
                self.scroll(direction, onDestroy);
            }, 10);
        }
    }
});

Crafty.c('StartButton', {
    init: function() {
        this.requires('Button, sprite_start_button');
    }
});

Crafty.c('Edge', {
    init: function() {
        this.requires('Actor, Solid')
            .attr({
                w: 1,
                h: 1
            });
    }
});

Crafty.c('Score', {
    init: function() {
        this.requires('2D, DOM, Text')
            .textColor('#FFFFFF', 1)
            .unselectable();

        this.bind('scoreUp', this.increment);
        this.setText(Game.score);
    },

    setText: function(score) {
        this.text('&nbsp;Score:&nbsp;' + score);
    },

    increment: function() {
        Game.score += 100;
        this.setText(Game.score);

        if (Game.score % Game.level.threshold.storm === 0) {
            Game.level.nbStorm++;
            Crafty.trigger('LevelUp', this);
        } else if (Game.score % Game.level.threshold.house === 0) {
            Game.level.nbHouse++;
            Crafty.trigger('LevelUp', this);
        }
    }
});

Crafty.c('FinalScore', {
    init: function() {
        this.requires('2D, DOM, Text, Grid')
            .text('&nbsp;Final&nbsp;Score:&nbsp;' + Game.score)
            .textColor('#FFFFFF', 1)
            .textFont({size: '20px', weight: 'bold'})
            .unselectable();
    }
});

Crafty.c('House', {
    reached: false,
    init: function() {
        var type = randomFromInterval(1, 3);
        this.requires('Actor, Solid, Scrollable, SpriteAnimation, sprite_house_' + type)
            .reel('reached', 1, 0, type - 1, 2);
    },

    isReached: function() {
        if (!this.reached) {
            this.reached = true;
            Crafty.trigger('scoreUp', this);
            this.animate('reached', 1);
        }
    }
});

Crafty.c('Cloud', {
    init: function() {
        this.requires('Actor, Scrollable, sprite_cloud')
            .attr({
                z: -1
            });
    }
});

Crafty.c('Storm', {
    init: function() {
        this.requires('Actor, Scrollable, Solid, SpriteAnimation, sprite_storm')
            .reel('storm', 500, 0, 0, 2);

        this.animate('storm', -1);
    }
});

Crafty.c('Sfeir', {
    _speed: 1,
    init: function() {
        this.requires('Actor, Collision, sprite_sfeir')
            .origin('center')
            .onHit('House', this.houseReached)

        this.turn();
        this.fall();
    },

    turn: function() {
        var self = this;
        self.rotation += 1;

        setTimeout(function() {
            self.turn();
        }, 1);
    },

    fall: function() {
        var self = this;
        self.y += self._speed;

        if (self.y - self.h > Game.height()) {
            this.destroy();
        } else {
            setTimeout(function() {
                self.fall();
            }, 1);
        }
    },

    houseReached: function(houses) {
        this.destroy();
        houses[0].obj.isReached();
    }
});

Crafty.c('Santa', {
    maxShoot: 1,
    init: function() {
        var animationSpeed = 500;
        this.requires('Actor, Fourway, Collision, SpriteAnimation, sprite_santa')
            .fourway(4)
            .onHit('Storm', this.gameOver)
            .onHit('Solid', this.stopMovement)
            .reel('PlayerShoot', animationSpeed, 1, 0, 2);
    },

    stopMovement: function() {
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
    },

    shoot: function() {
        if (Crafty('Sfeir').length < this.maxShoot) {
            this.animate('PlayerShoot', 1);
            Crafty.e('Sfeir').at(this.x / Game.mainGrid.tile.width, this.y / Game.mainGrid.tile.height);
        }
    },

    gameOver: function() {
        Crafty.scene('GameOver');
    }
});

Crafty.c('DeadSanta', {
    init: function() {
        this.requires('Actor, sprite_santa_dead');
    }
});

Crafty.c('Retry', {
    init: function() {
        this.requires('Button, sprite_retry')
            .uniqueBind('Click', this.restart);
    },

    restart: function() {
        Crafty.scene('Game');
    }
});

Crafty.c('Twitter', {
    init: function() {
        this.requires('Button, sprite_twitter')
            .uniqueBind('Click', this.share);
    },

    share: function() {
        console.log('share');
    }
});

Crafty.c('Google', {
    init: function() {
        this.requires('Button, sprite_google');
    }
});

Crafty.c('Facebook', {
    init: function() {
        this.requires('Button, sprite_facebook');
    }
});