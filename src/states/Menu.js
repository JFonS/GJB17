/**
 * Created by jfons on 1/21/17.
 */
import Fish from 'objects/Fish';
import GameState from 'states/GameState';

class Menu extends GameState {

    create() {
        super.create();
        let rnd = this.game.rnd;
        this.targetPosition = [new Phaser.Point(rnd.realInRange(100, this.game.width - 100), rnd.realInRange(100, this.game.height - 100))];
        this.dangers = [];//new Phaser.Point(this.game.width/2,this.game.height/2)];
        this.nextChange = this.game.time.now + rnd.realInRange(1, 6);

        for (let fish of this.fishes) {
            fish.targets = this.targetPosition;
            fish.dangers = this.dangers;
            fish.TARGET_FACTOR = 1.0;
        }

        /*let f = this.game.add.sprite(this.game.width/2,this.game.height/2,"fish00");
        f.scale.setTo(0.02);

        this.targetFish = this.game.add.sprite(this.targetPosition[0].x, this.targetPosition[0].y,"fish10");
        this.targetFish.scale.setTo(0.02);*/
    }

    update() {
        super.update();
        let rnd = this.game.rnd;
        if (this.game.time.now > this.nextChange) {
            this._updateTarget();
            this.nextChange = this.game.time.now + rnd.realInRange(200, 500);
        }
    }

    _updateTarget() {
        let rnd = this.game.rnd;

        let meanDir = new Phaser.Point(0, 0);
        let meanPos = new Phaser.Point(0, 0);

        for (let fish of this.fishes) {
            let dir = new Phaser.Point(fish._velocity.x, fish._velocity.y).normalize();
            meanDir.add(dir.x, dir.y);
            meanPos.add(fish.position.x, fish.position.y);
        }

        meanDir.divide(this.fishes.length, this.fishes.length);
        meanPos.divide(this.fishes.length, this.fishes.length);

        this.targetPosition[0] = new Phaser.Point(meanPos.x, meanPos.y);
        let dist = rnd.realInRange(300, 600);
        meanDir.multiply(dist, dist);
        meanDir.rotate(0, 0, rnd.realInRange(-45, 45), true);
        this.targetPosition[0].add(meanDir.x, meanDir.y);
        //this.targetFish.position = this.targetPosition[0];
    }
}

export default Menu;
