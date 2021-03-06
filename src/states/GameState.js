import Fish from 'objects/Fish';
import Caustics from 'objects/Caustics';
import LillyPad from 'objects/LillyPad';

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

        this.pads = [];

        this.padData = [{},
            {x: 1040, y: 130, r: 60},
            {x: 1107, y:  64, r: 45},
            {x:  183, y: 641, r: 40},
            {x:   70, y: 600, r: 60},
            {x:  170, y: 570, r: 40}];

        for (let i = 1; i < 6; ++i)  {
            let pad = new LillyPad(this.game, 'bg_o' + i, this.padData[i]);
            this.pads.push(pad);
            this.lillypadGroup.add(pad);
        }

        this.causticsRT = this.add.renderTexture(this.game.width, this.game.height);
        this.caustics = new Caustics(this.game, this.causticsRT);

        this.game.world.addChild(this.caustics);

        this.game.world.bringToTop(this.lillypadGroup);

				this.black = this.game.add.sprite(0, 0, 'black');
        this.add.tween(this.black).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 500);

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

				this.load.image('black', 'assets/black.png');


    }

    preRender() {
        let pads = []
        for (let p of this.pads) {
            pads.push(Phaser.Point.add(p.body.offset,p.position).add(p.r,p.r));
        }
        console.log(pads);
        this.caustics.setPads(pads);
        this.fishGroup.visible = true;
        this.causticsRT.renderXY(this.fishGroup,0,0);
        this.fishGroup.visible = false;
    }

    update() {
        for (let b1 of this.pads) {
            for (let b2 of this.pads) {
                if (b1 === b2) continue;
                this.game.physics.arcade.collide(b1, b2);
            }
        }
    }
}

export
default
GameState;
