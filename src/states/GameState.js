import Fish from 'objects/Fish';
import Caustics from 'objects/Caustics';

class GameState extends Phaser.State {

    create() {
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }


        let rnd = this.game.rnd;

        this.fishGroup = this.game.add.group(); //new Phaser.Group(this.game,null,'underwater');
        this.lillypadGroup = this.game.add.group();

        this.fishes = [];

        this.fishGroup.create(0, 0, 'bg');

        for (let i = 0; i < 50; ++i) {
            let fish = new Fish(this.game, rnd.realInRange(100, this.game.width - 100), rnd.realInRange(100, this.game.height - 100));
            this.fishes.push(fish);
            this.fishGroup.add(fish);
        }

        this.fishGroup.visible = false;

        this.fishes[0].debugger = true;

        for (let i = 1; i < 6; ++i) this.lillypadGroup.create(0, 0, 'bg_o' + i);

        //this.game.world.bringToTop(this.fishGroup);

        this.causticsRT = this.add.renderTexture(this.game.width, this.game.height);
        this.caustics = new Caustics(this.game, this.causticsRT);

        this.game.world.addChild(this.caustics);

        this.game.world.bringToTop(this.lillypadGroup);

        let music = this.add.audio('zen');
        music.play();

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

        this.load.audio('zen', 'assets/Music/Audio.mp3');
        this.load.image('caustics', 'assets/sprites/caustics.jpg');
        this.load.shader('caustics', 'assets/shaders/caustics.frag');
    }

    preRender() {
        this.fishGroup.visible = true;
        this.causticsRT.renderXY(this.fishGroup,0,0);
        this.fishGroup.visible = false;
    }

    update() {
       // this.fishGroup.update();
    }
}

export
default
GameState;
