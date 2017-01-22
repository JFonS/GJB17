import Level1 from 'states/Level1';
import Menu from 'states/Menu';

class Game extends Phaser.Game {

	constructor() {
		super(1200, 700, Phaser.AUTO, 'content', null);
		this.state.add('Menu', Menu, false);
		this.state.add("Level1", Level1, false);
		//this.state.start('Level1');
		this.state.start('Menu');
    }
}

new Game();
