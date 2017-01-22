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

        //this.overlay = this.game.add.sprite(0,0,this._overlayName);

        //this.game.add.tween(this.overlay).to( { alpha: 1 }, 2000, Phaser.Easing.Quadratic);

    }

    preload() {
        super.preload();
    }

    update() {
        super.update();
    }

    _onRightClick() {

        let danger = new Phaser.Point(this.game.input.mousePointer.x,this.game.input.mousePointer.y);

        this.dangers.push(danger);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {
            console.log(danger);
            let i = this.dangers.indexOf(danger);
            if (i > -1) {
                this.dangers.splice(i, 1);
            }
        }, this);
    }

    _onLeftClick() {

        let target = new Phaser.Point(this.game.input.mousePointer.x,this.game.input.mousePointer.y);

        this.targets.push(target);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {
            console.log(target);
            let i = this.targets.indexOf(target);
            if (i > -1) {
                this.targets.splice(i, 1);
            }

        }, this);
    }
}

export default InGame;
