import InGame from 'states/InGame';
import Menu from 'states/Menu';

class Game extends Phaser.Game {

	constructor() {
		super(1200, 700, Phaser.AUTO, 'content', null);
		this.state.add('Menu', Menu, false);
		this.state.add('InGame', InGame, false);
		this.state.start('InGame');
    }
}

new Game();
