//import Vec2 from 'objects/Vec2';

class Fish extends Phaser.Sprite {

    constructor(game, x, y) {

        super(game, x, y, 'fish');

        this.scale.setTo(0.1,0.1);
        this.anchor.set(0.5);

        // Constants
        this.NEIGHBOUR_RADIUS = 300;
        this.SEPARATION_RADIUS = 40;

        this.MAX_SPEED = 30;
        this.MAX_FORCE = 0.06;

        this.COHESION_FACTOR = 0.1;
        this.ALIGNMENT_FACTOR = 0.2;
        this.SEPARATION_FACTOR = 0.4;
        this.TARGET_FACTOR = 0.3;

        this._velocity = new Phaser.Point(0, 0);
    }

    update() {
        let deltaTime = this.game.time.elapsed / 1000;

        let state = this.game.state.getCurrentState();
        let acceleration = this._flock(state.fishes, state.targetPosition);

        //if (acceleration.getMagnitude() > this.MAX_FORCE) acceleration.setMagnitude(this.MAX_FORCE);

        this._velocity.add(acceleration.x, acceleration.y);
        //if (this._velocity.getMagnitude() > this.MAX_SPEED) this._velocity.setMagnitude(this.MAX_SPEED);

        let vel = new Phaser.Point(this._velocity.x, this._velocity.y);
        vel.multiply(deltaTime, deltaTime);


        this.position.add(vel.x, vel.y);
        this.angle = this._velocity.angle(new Phaser.Point(0,0), true) - 90;
    }

    _flock(swarm, targetPos) {
        let cohesion = this._cohere(swarm).multiply(this.COHESION_FACTOR,this.COHESION_FACTOR);
        let alignment = this._align(swarm).multiply(this.ALIGNMENT_FACTOR,this.ALIGNMENT_FACTOR);
        let separation = this._separate(swarm).multiply(this.SEPARATION_FACTOR,this.SEPARATION_FACTOR);
        let target = this._steerTo(targetPos);//.multiply(this.TARGET_FACTOR,this.TARGET_FACTOR);

        let acceleration = new Phaser.Point(0,0);
        acceleration.add(alignment.x,alignment.y);
        acceleration.add(separation.x,separation.y);
        acceleration.add(cohesion.x,cohesion.y);
        acceleration.add(target.x,target.y);

        return acceleration;
    }

    _cohere(swarm) {
        let mean = new Phaser.Point(0, 0);
        let count = 0;
        for (let fish of swarm) {
            if (fish === this) continue;
            //let distance = this.position.distance(fish.position);
            //if (distance < this.NEIGHBOUR_RADIUS) {
                mean.add(fish.position.x,fish.position.y);
                ++count;
            //}
        }

        return (count > 0) ? this._steerTo(mean.divide(count, count)) : mean;
    }

    _steerTo(target) {
        let desired = new Phaser.Point(target.x,target.y);
        desired.subtract(this.position.x, this.position.y);

        let oldx = desired.x, oldy = desired.y;
        let d = desired.getMagnitude();
        if (d == 0) return new Vec2(0, 0);

        desired.normalize();

        let vel = this.MAX_SPEED;

        //Dampen closest neighbours
        if (d < 100.0) vel = this.MAX_SPEED * (d / 100.0);

        desired.multiply(vel, vel);

        //Steering = Desired minus Velocity
        let steer = desired.subtract(this._velocity.x, this._velocity.y);

        //Clamp magnitude
        if (steer.getMagnitude() > this.MAX_FORCE) steer.setMagnitude(this.MAX_FORCE);

        if (isNaN(steer.x)) {
            return new Phaser.Point(0,0);
        }
        return steer;
    }

    _align(swarm) {
        let mean = new Phaser.Point(0,0);
        let count = 0;

        for (let fish of swarm) {
            if (fish === this) continue;
            let distance = this.position.distance(fish.position);
            if (distance < this.NEIGHBOUR_RADIUS) {
                mean.add(fish._velocity.x,fish._velocity.y);
                count++;
            }
        }

        if (count > 0) mean.divide(count,count);

        if (mean.getMagnitude() > this.MAX_FORCE) mean.setMagnitude(this.MAX_FORCE);

        return mean;
    }

    _separate(swarm) {
        let mean = new Phaser.Point(0, 0);

        for (let fish of swarm) {
            if (fish === this) continue;
            let distance = this.position.distance(fish.position);

            if (distance < this.SEPARATION_RADIUS) {
                let desired = new Phaser.Point(this.position.x,this.position.y);
                desired.subtract(fish.position.x, fish.position.y);
                if (distance > 0) desired.divide(distance^1.001,distance^1.001);
                mean.add(desired.x,desired.y);
            }
        }


        if (this.position.x < this.SEPARATION_RADIUS) {
            mean.add((this.SEPARATION_RADIUS-this.position.x)/this.SEPARATION_RADIUS,0);
        }

        if (this.position.x > this.game.width - this.SEPARATION_RADIUS) {
            mean.add( ((this.game.width - this.SEPARATION_RADIUS) - this.position.x)/this.SEPARATION_RADIUS, 0);
        }

        if (this.position.y < this.SEPARATION_RADIUS) {
            mean.add(0,(this.SEPARATION_RADIUS-this.position.y)/this.SEPARATION_RADIUS);
        }

        if (this.position.y > this.game.height - this.SEPARATION_RADIUS) {
            mean.add(0, ((this.game.height - this.SEPARATION_RADIUS) - this.position.y)/this.SEPARATION_RADIUS);
        }

        return mean;
    }

}

export default Fish;