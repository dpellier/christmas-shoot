
Game = {
    mainGrid: {
        width: 32,
        height: 24,
        tile: {
            width: 16,
            height: 16
        }
    },

    initScore: 0,
    initNbHouse: 1,
    initNbStorm: 1,

    currentScene: '',
    score: this.initScore,

    level: {
        threshold: {
            house: 500,
            storm: 1000
        },
        nbStorm: this.initNbStorm,
        nbHouse: this.initNbHouse
    },

    width: function() {
        return this.mainGrid.width * this.mainGrid.tile.width;
    },

    height: function() {
        return this.mainGrid.height * this.mainGrid.tile.height;
    },

    playgroundHeight: function() {
        return this.mainGrid.height / 2;
    },

    start: function() {
        Crafty.init(Game.width(), Game.height());

        Crafty.background('url("assets/start.jpg")');

        Crafty.scene('Start');
    },

    reset: function() {
        this.score = this.initScore;
        this.level.nbStorm = this.initNbStorm;
        this.level.nbHouse = this.initNbHouse;
    }
};

function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}