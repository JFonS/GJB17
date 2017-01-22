/**
 * Created by jfons on 1/22/17.
 */

class Caustics extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, 'caustics');
        this.blendMode = PIXI.blendModes.ADD;
        this.width = this.game.width;
        this.height = this.game.height;

        let filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('caustics'));
        filter.setResolution(this.game.width, this.game.height);
        this.filters = [filter]; //.addToWorld(0, 0, 1200, 700);
    }

    update() {
        this.filters[0].update(this.game.input.mousePointer);
    }
}


export default Caustics;