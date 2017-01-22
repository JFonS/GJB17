/**
 * Created by jfons on 1/22/17.
 */

class LillyPad extends Phaser.Sprite {
    constructor(game, texture,data) {
        super(game, 0, 0, texture);
        this.game.physics.arcade.enable(this);

        // random movement range
        /*let range = this.game.rnd.between(60, 120);
        // random duration of complete move
        let duration = this.game.rnd.between(300000, 500000);
        // random parameters for wiggle easing function
        let xPeriod1 = this.game.rnd.between(2, 13);
        let xPeriod2 = this.game.rnd.between(2, 13);
        let yPeriod1 = this.game.rnd.between(2, 13);
        let yPeriod2 = this.game.rnd.between(2, 13);

        // set tweens for horizontal and vertical movement
        let xTween = this.game.add.tween(this)
        xTween.to({ x: this.position.x + range }, duration, function (aProgress) {
            return wiggle(aProgress, xPeriod1, xPeriod2);
        }, true, 0, -1);

        let yTween = this.game.add.tween(this.body)
        yTween.to({ y: this.position.y + range }, duration, function (aProgress) {
            return wiggle(aProgress, yPeriod1, yPeriod2);
        }, true, 0, -1);*/

        //this.anchor.set(data.x/game.width,data.y/game.height);
        this.body.offset.set(data.x-data.r,data.y-data.r);
        this.body.setCircle(data.r);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(0.2);
        this.body.gravity.y = 20;
        this.r = data.r;
        this.GRAVITY = 30;
    }

    update() {
        let r = this.game.rnd;
        this.body.gravity.set(r.realInRange(-1,1),r.realInRange(-1,1));
        this.body.gravity.multiply(this.GRAVITY,this.GRAVITY);
    }
}

function wiggle(aProgress, aPeriod1, aPeriod2) {
    let current1 = aProgress * Math.PI * 2 * aPeriod1;
    let current2 = aProgress * Math.PI * 2 * aPeriod2;

    return Math.sin(current1) * Math.cos(current2);
}


export default LillyPad;