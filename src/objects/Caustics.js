/**
 * Created by jfons on 1/22/17.
 */

class Caustics extends Phaser.Sprite {
    constructor(game, renderTexture) {
        super(game, 0, 0, renderTexture);
        //this.blendMode = PIXI.blendModes.ADD;
        this.width = this.game.width;
        this.height = this.game.height;

        let uniforms = {};
        uniforms.ripple = { type: '2f', value: 1.0 };
        uniforms.fadeTime = {type: '1f', value: 0.5};

        let filter = new Phaser.Filter(this.game, uniforms, this.game.cache.getShader('caustics'));
        filter.setResolution(this.game.width, this.game.height);
        this.filters = [filter];
    }

    update() {
        let f = this.filters[0];
        f.update(this.game.input.mousePointer);
    }

    setUniforms(data) {
        let f = this.filters[0];
        f.uniforms.ripple.value = data.ripplePos;
        f.uniforms.fadeTime.value = data.fadeTime;
    }
}


export default Caustics;