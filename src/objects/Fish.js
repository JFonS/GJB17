//import Vec2 from 'objects/Vec2';

class Fish extends Phaser.Sprite {

    constructor(game, x, y) {

        let color_fish = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        let pattern_fish = Math.floor(Math.random() * (2 - 0 + 1)) + 0;

        super(game, x, y, ('fish').concat(color_fish.toString()).concat(pattern_fish.toString()));

        this.scale.setTo(0.1, 0.1);
        this.anchor.set(0.5);

        // Constants
        this.NEIGHBOUR_RADIUS = 300;
        this.SEPARATION_RADIUS = 50;
        this.TARGET_RADIUS = 300;
        this.DANGER_RADIUS = 100;

        this.MAX_SPEED = 50;
        this.MAX_FORCE = 0.03;
        this.MAX_ACCEL = 1.0;

        this.COHESION_FACTOR = 1.5;
        this.ALIGNMENT_FACTOR = 1.5;
        this.SEPARATION_FACTOR = 3;
        this.TARGET_FACTOR = 3;
        this.DANGER_FACTOR = 2;

        this.ANIM_FPS = 0.25;
        this.MAX_ANIM_FPS = 15;
        this.DRAG = 0.01;

        /*//////////////////////////////
        this.NEIGHBOUR_RADIUS = 300;
        this.SEPARATION_RADIUS = 50;
        this.TARGET_RADIUS = 300;
        this.DANGER_RADIUS = 100;

        this.MAX_SPEED = 50;
        this.MAX_FORCE = 0.06;

        this.COHESION_FACTOR = 0.5;
        this.ALIGNMENT_FACTOR = 0.5;
        this.SEPARATION_FACTOR = 0.5;
        this.TARGET_FACTOR = 0.7;
        this.DANGER_FACTOR = 0.7;

        this.ANIM_FPS = 0.25;
        this.MAX_ANIM_FPS = 15;
        */

        this._velocity = new Phaser.Point(this.game.rnd.realInRange(-20, 20), this.game.rnd.realInRange(-20, 20), 0);
        this.targets = [];
        this.dangers = [];

        this.animations.add('swim');
        this.animations.play('swim', 20, true);
    }

    update() {
        let oldPos = new Phaser.Point(this.position.x, this.position.y);
        let oldVel = new Phaser.Point(this._velocity.x, this._velocity.y);

        let deltaTime = this.game.time.elapsed / 1000;

        let state = this.game.state.getCurrentState();
        let acceleration = this._flock(state.fishes, state.targetPosition);

        if (acceleration.getMagnitude() > this.MAX_ACCEL) acceleration.setMagnitude(this.MAX_ACCEL);

        this._velocity.add(acceleration.x, acceleration.y);
        if (this._velocity.getMagnitude() > this.MAX_SPEED) this._velocity.setMagnitude(this.MAX_SPEED);

        if (isNaN(this._velocity.x) || isNaN(this._velocity.y)) this._velocity = oldVel;

        let vel = new Phaser.Point(this._velocity.x, this._velocity.y);
        vel.multiply(deltaTime, deltaTime);

        this.position.add(vel.x, vel.y);
        if (isNaN(this.position.x) || isNaN(this.position.y)) this.position = oldPos;

        this.angle = this._velocity.angle(new Phaser.Point(0, 0), true) - 90;
        this.animations._anims.swim.speed = Math.min(this.MAX_ANIM_FPS, this.ANIM_FPS * this._velocity.getMagnitude());

        let drag = 1.0 - this.DRAG * deltaTime;
        this._velocity.multiply(drag,drag);

    }

    _flock(swarm) {
        let cohesion = this._cohere(swarm).multiply(this.COHESION_FACTOR, this.COHESION_FACTOR);
        let alignment = this._align(swarm).multiply(this.ALIGNMENT_FACTOR, this.ALIGNMENT_FACTOR);
        let separation = this._separate(swarm).multiply(this.SEPARATION_FACTOR, this.SEPARATION_FACTOR);
        let target = this._target().multiply(this.TARGET_FACTOR, this.TARGET_FACTOR);
        let danger = this._danger().multiply(this.DANGER_FACTOR, this.DANGER_FACTOR);

        let acceleration = new Phaser.Point(0, 0);
        if (!isNaN(alignment.x)) acceleration.add(alignment.x, alignment.y);
        if (!isNaN(separation.x)) acceleration.add(separation.x, separation.y);
        if (!isNaN(cohesion.x)) acceleration.add(cohesion.x, cohesion.y);
        if (!isNaN(target.x)) acceleration.add(target.x, target.y);
        if (!isNaN(danger.x)) acceleration.add(danger.x, danger.y);

        if (this.debugger && isNaN(acceleration.x)) {
            console.log(swarm);
            console.log("alignment", alignment);
            console.log("separation", separation);
            console.log("cohesion", cohesion);
            console.log("target", target);
            console.log("danger", danger);
        }
        return acceleration;
    }

    _cohere(swarm) {
        let mean = new Phaser.Point(0, 0);
        let count = 0;
        for (let fish of swarm) {
            if (fish === this) continue;
            let distance = this.position.distance(fish.position);
            if (distance < this.NEIGHBOUR_RADIUS) {
                mean.add(fish.position.x, fish.position.y);
                ++count;
            }
        }

        return (count > 0) ? this._steerTo(mean.divide(count, count)) : mean;
    }

    _steerTo(target) {
        let desired = new Phaser.Point(target.x - this.position.x, target.y - this.position.y);

        let d = desired.getMagnitude();

        //if (this.debugger) console.log(target,this.position, desired, d);
        if (d == 0) return new Phaser.Point(0, 0);

        desired.normalize();

        let vel = this.MAX_SPEED;

        //Dampen closest neighbours
        if (d < 200.0) vel = this.MAX_SPEED * (d / 100.0);

        desired.multiply(vel, vel);

        //Steering = Desired minus Velocity
        let steer = desired.subtract(this._velocity.x, this._velocity.y);

        //Clamp magnitude
        if (steer.getMagnitude() > this.MAX_FORCE) steer.setMagnitude(this.MAX_FORCE);
        return steer;
    }

    _align(swarm) {
        let mean = new Phaser.Point(0, 0);
        let count = 0;

        for (let fish of swarm) {
            if (fish === this) continue;
            let distance = this.position.distance(fish.position);
            if (distance < this.NEIGHBOUR_RADIUS) {
                mean.add(fish._velocity.x, fish._velocity.y);
                count++;
            }
        }

        if (count > 0) mean.divide(count, count);

        if (mean.getMagnitude() > this.MAX_FORCE) mean.setMagnitude(this.MAX_FORCE);

        return mean;
    }

    _separate(swarm) {
        let mean = new Phaser.Point(0, 0);

        for (let fish of swarm) {
            if (fish === this) continue;
            let distance = this.position.distance(fish.position);

            if (distance < this.SEPARATION_RADIUS) {
                let desired = new Phaser.Point(this.position.x, this.position.y);
                desired.subtract(fish.position.x, fish.position.y);
                if (distance > 0) {
                    let factor = Math.max(0.01, 1.0/distance);
                    desired.multiply(factor,factor);
                    mean.add(desired.x, desired.y);
                }
            }
        }

        if (this.position.x < this.SEPARATION_RADIUS) {
            mean.add((this.SEPARATION_RADIUS - this.position.x) / this.SEPARATION_RADIUS, 0);
        }

        if (this.position.x > this.game.width - this.SEPARATION_RADIUS) {
            mean.add(((this.game.width - this.SEPARATION_RADIUS) - this.position.x) / this.SEPARATION_RADIUS, 0);
        }

        if (this.position.y < this.SEPARATION_RADIUS) {
            mean.add(0, (this.SEPARATION_RADIUS - this.position.y) / this.SEPARATION_RADIUS);
        }

        if (this.position.y > this.game.height - this.SEPARATION_RADIUS) {
            mean.add(0, ((this.game.height - this.SEPARATION_RADIUS) - this.position.y) / this.SEPARATION_RADIUS);
        }

        return mean;
    }

    _target() {
        let result = new Phaser.Point(0, 0);
        for (let target of this.targets) {
            let distance = this.position.distance(target);
            if (distance < this.TARGET_RADIUS) {
                let steer = this._steerTo(target);
                if (distance > 0) {
                    steer.normalize().multiply(10,10);
                    steer.divide(distance, distance);
                    result.add(steer.x, steer.y);
                }
            }
        }

        return result;
    }

    _danger() {
        let result = new Phaser.Point(0, 0);
        for (let danger of this.dangers) {
            let distance = this.position.distance(danger);
            if (distance < this.DANGER_RADIUS) {
                let desired = new Phaser.Point(this.position.x, this.position.y);
                desired.subtract(danger.x, danger.y);
                if (distance > 0) {
                    desired.divide(distance, distance);
                    result.add(desired.x, desired.y);
                }
            }
        }
        return result;
    }

}

export default Fish;
