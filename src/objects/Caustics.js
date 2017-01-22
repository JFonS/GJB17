/**
 * Created by jfons on 1/22/17.
 */

class Caustics extends Phaser.Sprite {
    constructor(game, renderTexture, targets, dangers) {
        super(game, 0, 0, renderTexture);
        this.blendMode = PIXI.blendModes.ADD;
        this.width = this.game.width;
        this.height = this.game.height;

        this.targets = targets;
        this.dangers = dangers;

        let filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('caustics'));
        filter.setResolution(this.game.width, this.game.height);
        this.filters = [filter];
    }

    update() {
        this.filters[0].update(this.game.input.mousePointer);
    }
}


export default Caustics;