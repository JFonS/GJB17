import Fish from 'objects/Fish';

class GameState extends Phaser.State {

    create() {
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }


        let rnd = this.game.rnd;

        this.fishGroup = this.game.add.group();
        this.lillypadGroup = this.game.add.group();

        this.fishes = [];

        this.game.add.sprite(0, 0, 'bg');

        for (let i = 0; i < 50; ++i) {
            let fish = new Fish(this.game, rnd.realInRange(100, this.game.width - 100), rnd.realInRange(100, this.game.height - 100));
            this.fishes.push(fish);
            this.fishGroup.add(fish);
        }

        this.fishes[0].debugger = true;

        for (let i = 1; i < 6; ++i) this.lillypadGroup.create(0, 0, 'bg_o' + i);

        this.game.world.bringToTop(this.fishGroup);
        this.game.world.bringToTop(this.lillypadGroup);


        let fragmentAigua = [
            "precision mediump float;",
            "uniform float     time;",
            "uniform vec2      resolution;",
            "uniform vec2      mouse;",

            "uniform sampler2D uSampler;",
            "varying vec2 vTextureCoord;",

            "void main(void) {",
            //"vec4 texColor = texture2D(uSampler, vTextureCoord);",
            "gl_FragColor = vec4(1); //texColor",
            //"vec2 uv = fragCoord.xy / iResolution.xy;",
            //"vec2 warpUV = 2. * uv;",

            //"float d = length( warpUV );",
            //"vec2 st = warpUV*0.1 + 0.2*vec2(cos(0.071*iGlobalTime*2.+d), sin(0.073*iGlobalTime*2.-d));",

            //"vec3 warpedCol = texture2D( iChannel0, st ).xyz * 2.0;",
            //"float w = max( warpedCol.r, 0.85);",

            //"vec2 offset = 0.01 * cos( warpedCol.rg * 3.14159 );",
            //"vec3 col = texture2D( iChannel1, uv + offset ).rgb * vec3(0.8, 0.8, 1.5) ;",
            //"col *= w*1.2;",

            //"fragColor = vec4( mix(col, texture2D( iChannel1, uv + offset ).rgb, 0.5),  1.0);",

            "}"
        ];
        //let filter = new Phaser.Filter(this.game, {}, fragmentAigua);
        // filter.addToWorld(0, 0, 1200, 700);

    }

    preload() {
        this.game.stage.disableVisibilityChange = true;
        this.load.image('bg', 'assets/sprites/bg/texturedBG.png');
        this.load.image('bg_o1', 'assets/sprites/bg/lilly_overlay_1.png');
        this.load.image('bg_o2', 'assets/sprites/bg/lilly_overlay_2.png');
        this.load.image('bg_o3', 'assets/sprites/bg/lilly_overlay_3.png');
        this.load.image('bg_o4', 'assets/sprites/bg/lilly_overlay_4.png');
        this.load.image('bg_o5', 'assets/sprites/bg/lilly_overlay_5.png');
        this.load.spritesheet('fish00', 'assets/sprites/00.png', 522, 561);
        this.load.spritesheet('fish01', 'assets/sprites/01.png', 522, 561);
        this.load.spritesheet('fish02', 'assets/sprites/02.png', 522, 561);
        this.load.spritesheet('fish10', 'assets/sprites/10.png', 522, 561);
        this.load.spritesheet('fish11', 'assets/sprites/11.png', 522, 561);
        this.load.spritesheet('fish12', 'assets/sprites/12.png', 522, 561);
        this.load.spritesheet('fish20', 'assets/sprites/20.png', 522, 561);
        this.load.spritesheet('fish21', 'assets/sprites/21.png', 522, 561);
        this.load.spritesheet('fish22', 'assets/sprites/22.png', 522, 561);
    }

    update() {

    }
}

export
default
GameState;
