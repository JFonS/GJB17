import GameState from 'states/GameState';

class Game extends Phaser.Game {

	constructor() {
		super(1200, 700, Phaser.AUTO, 'content', null);
		this.state.add('GameState', GameState, false);
		this.state.start('GameState');
	}
}

let banana = new Game();
