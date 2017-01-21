import RainbowText from 'objects/RainbowText';
import Fish from 'objects/Fish';

class GameState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
        let rnd = this.game.rnd;

        this.fishes = [];
        this.targetPosition = new Phaser.Point(rnd.realInRange(0,500), rnd.realInRange(0,500));
        this.nextChange = this.game.time.now + rnd.realInRange(1,6);
				this.game.add.sprite(0, 0, 'bg');
        for (let i = 0; i < 100; ++i) {
		    let fish = new Fish(this.game, rnd.integerInRange(0, 500), rnd.integerInRange(0, 500));
		    this.fishes.push(fish);
		    this.game.stage.addChild(fish);
				this.game.add.sprite(0, 0, 'bg_o5');
				this.game.add.sprite(0, 0, 'bg_o4');
				this.game.add.sprite(0, 0, 'bg_o3');
				this.game.add.sprite(0, 0, 'bg_o2');
				this.game.add.sprite(0, 0, 'bg_o1');
        }
	}

    preload() {
        this.game.stage.disableVisibilityChange = true;
				this.load.image('bg', 'assets/sprites/bg/texturedBG.png');
				this.load.image('bg_o1', 'assets/sprites/bg/lilly_overlay_1.png');
				this.load.image('bg_o2', 'assets/sprites/bg/lilly_overlay_2.png');
				this.load.image('bg_o3', 'assets/sprites/bg/lilly_overlay_3.png');
				this.load.image('bg_o4', 'assets/sprites/bg/lilly_overlay_4.png');
				this.load.image('bg_o5', 'assets/sprites/bg/lilly_overlay_5.png');
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
