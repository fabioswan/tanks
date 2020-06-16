import { Tank } from './Tank.js';
import {Bullet} from './Bullet.js'


export class Player extends Tank {
  constructor(x,y,tileSize,game) {
    let width = tileSize;
    let height = tileSize;
    super(x,y,tileSize,game);
    this.shooting = false;
    this.speed = 16;
    this.type = "Player";
    this.bullets = game.bullets;
    this.bulletSpeed = 21;
    this.fireRate = 20;
    this.counter = 0;


  }

  update() {
    super.update();
    if(this.counter <= this.fireRate) { this.counter ++; }
    if(this.counter >= this.fireRate) {
      if(this.shooting) {
        this.shoot();
        this.counter = 0;
      }
    }
  }

  draw(ctx, images) {
    switch(this.type) {
      case "Player":
        super.draw(ctx, images.playerTank, images.playerTurret);
        break;
    }
  }

  shoot() {
    let delta = {
      x: this.mouse[0] - (this.x + this.width/2),
      y: this.mouse[1] - (this.y + this.height/2)
    }

    this.normalize(delta);

    this.bullets.push(new Bullet(this._x+this.width/2 + (delta.x*256),this._y+this.height/2 + (delta.y*256),delta.x*this.bulletSpeed,delta.y*this.bulletSpeed,this));
  }

  normalize(point) {
    var magnitude = Math.sqrt(point.x * point.x + point.y * point.y);
    if (magnitude !== 0) {
      point.x = 1 * point.x / magnitude;
      point.y = 1 * point.y / magnitude;
    }
  }
}
