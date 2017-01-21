import RainbowText from 'objects/RainbowText';
import Fish from 'objects/Fish';

class GameState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
        let rnd = this.game.rnd;

        this.fishes = [];
        this.targetPosition = new Phaser.Point(rnd.realInRange(0,500), rnd.realInRange(0,500));
        this.nextChange = this.game.time.now + rnd.realInRange(1,6);

        for (let i = 0; i < 100; ++i) {
		    let fish = new Fish(this.game, rnd.integerInRange(0, 500), rnd.integerInRange(0, 500));
		    this.fishes.push(fish);
		    this.game.stage.addChild(fish);
        }
	}

    preload() {
        this.game.stage.disableVisibilityChange = true;
        this.load.spritesheet('fish', 'assets/sprites/00.png', 522,561);
    }

    update() {
        let rnd = this.game.rnd;

	    if (this.game.time.now > this.nextChange) {
            this.targetPosition = new Phaser.Point(rnd.integerInRange(0,500), rnd.integerInRange(0,500));
            this.nextChange = this.game.time.now + rnd.realInRange(10000,60000);
        }

    }
}

export default GameState;
