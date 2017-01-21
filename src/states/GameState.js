import RainbowText from 'objects/RainbowText';
import Fish from 'objects/Fish';

class GameState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
        let rnd = this.game.rnd;

		this.fishGroup = this.game.add.group();
		this.lillypadGroup = this.game.add.group();

        this.fishes = [];
        this.targetPosition = new Phaser.Point(rnd.realInRange(100,400), rnd.realInRange(0,500));
        this.nextChange = this.game.time.now + rnd.realInRange(1,6);
		this.game.add.sprite(0, 0, 'bg');

		for (let i = 0; i < 50; ++i) {
		    let fish = new Fish(this.game, rnd.integerInRange(0, 500), rnd.integerInRange(0, 500));
		    this.fishes.push(fish);
		    this.game.stage.addChild(fish);
		    //this.fishGroup.add(fish);
        }

        this.lillypadGroup.add(this.game.add.sprite(0, 0, 'bg_o5'));
        this.lillypadGroup.add(this.game.add.sprite(0, 0, 'bg_o4'));
        this.lillypadGroup.add(this.game.add.sprite(0, 0, 'bg_o3'));
        this.lillypadGroup.add(this.game.add.sprite(0, 0, 'bg_o2'));
        this.lillypadGroup.add(this.game.add.sprite(0, 0, 'bg_o1'));

        this.game.world.bringToTop(this.lillypadGroup);
	}

    preload() {
        this.game.stage.disableVisibilityChange = true;
				this.load.image('bg', 'assets/sprites/bg/texturedBG.png');
				this.load.image('bg_o1', 'assets/sprites/bg/lilly_overlay_1.png');
				this.load.image('bg_o2', 'assets/sprites/bg/lilly_overlay_2.png');
				this.load.image('bg_o3', 'assets/sprites/bg/lilly_overlay_3.png');
				this.load.image('bg_o4', 'assets/sprites/bg/lilly_overlay_4.png');
				this.load.image('bg_o5', 'assets/sprites/bg/lilly_overlay_5.png');
        this.load.spritesheet('fish00', 'assets/sprites/00.png', 522,561);
				this.load.spritesheet('fish01', 'assets/sprites/01.png', 522,561);
				this.load.spritesheet('fish02', 'assets/sprites/02.png', 522,561);
				this.load.spritesheet('fish10', 'assets/sprites/10.png', 522,561);
				this.load.spritesheet('fish11', 'assets/sprites/11.png', 522,561);
				this.load.spritesheet('fish12', 'assets/sprites/12.png', 522,561);
				this.load.spritesheet('fish20', 'assets/sprites/20.png', 522,561);
				this.load.spritesheet('fish21', 'assets/sprites/21.png', 522,561);
				this.load.spritesheet('fish22', 'assets/sprites/22.png', 522,561);
    }

    update() {
        let rnd = this.game.rnd;

	    if (this.game.time.now > this.nextChange) {
            //this.targetPosition = new Phaser.Point(rnd.integerInRange(100,400), rnd.integerInRange(0,500));
            let meanDir = new Phaser.Point(0,0);
            let meanPos = new Phaser.Point(0,0);

            for (let fish of this.fishes) {
                let dir = new Phaser.Point(fish._velocity.x, fish._velocity.y).normalize();
                meanDir.add(dir.x,dir.y);
                meanPos.add(fish.position.x, fish.position.y);
            }

            meanDir.divide(this.fishes.length,this.fishes.length);
            //console.log(meanDir, meanDir.getMagnitude());
            meanPos.divide(this.fishes.length,this.fishes.length);

            this.targetPosition = new Phaser.Point(meanPos.x, meanPos.y);
            let dist = rnd.realInRange(100,300);
            meanDir.multiply(dist,dist);
            meanDir.rotate(0,0,rnd.realInRange(-45,45),true);
            this.targetPosition.add(meanDir.x,meanDir.y);

            this.nextChange = this.game.time.now + rnd.realInRange(200,500);
        }

    }
}

export default GameState;
