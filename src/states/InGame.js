/**
 * Created by jfons on 1/21/17.
 */
import Fish from 'objects/Fish';
import GameState from 'states/GameState';

class InGame extends GameState {

    create() {
        super.create();
        this.game.input.mousePointer.rightButton.onDown.add(this._onRightClick, this);
        this.game.input.mousePointer.leftButton.onDown.add(this._onLeftClick, this);

        this.targets = [];
        this.dangers = [];

        for (let fish of this.fishes) {
            fish.targets = this.targets;
            fish.dangers = this.dangers;
        }

        this.lastTimer = null;
        this.rippleTime = Phaser.Timer.SECOND * 4;
    }

    preload() {
        super.preload();
        this.load.spritesheet('bait', 'assets/sprites/bait',70,80);
        this.load.spritesheet('stones', 'assets/sprites/bait',60,55);
    }

    preRender() {
        let rPos = new Phaser.Point(10000,10000);
        if (this.targets.length > 0) {
            rPos = this.targets[this.targets.length - 1];
        } else if (this.dangers.length > 0) {
            rPos = this.dangers[this.dangers.length - 1];
        }
        let data = {
            ripplePos: rPos,
            fadeTime: this.targets.length + this.dangers.length > 0 ? 1.0 - (this.game.time.now - this.lastTimer)/this.rippleTime : 0.0
        };


        this.caustics.setUniforms(data);

        super.preRender();
    }

    update() {
        super.update();
    }

    _onRightClick() {

        let danger = new Phaser.Point(this.game.input.mousePointer.x,this.game.input.mousePointer.y);

        this.dangers.push(danger);
        this.game.time.events.add(this.rippleTime, function() {
            console.log(danger);
            let i = this.dangers.indexOf(danger);
            if (i > -1) {
                this.dangers.splice(i, 1);
            }
        }, this);

        this.lastTimer = this.game.time.now;
    }

    _onLeftClick() {

        let target = new Phaser.Point(this.game.input.mousePointer.x,this.game.input.mousePointer.y);

        this.targets.push(target);
        this.game.time.events.add(this.rippleTime, function() {
            console.log(target);
            let i = this.targets.indexOf(target);
            if (i > -1) {
                this.targets.splice(i, 1);
            }

        }, this);
        this.lastTimer = this.game.time.now;
    }
}

export default InGame;
