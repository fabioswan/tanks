import {GameObject} from './GameObject.js'

export class Entity extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.rotation = 0;
    this.speed = 1;
    this.dx = 0;
    this.dy = 0;
    this.alive = true;
  }

  update() {
    super.update();
    this.updateLocation();
  }

  draw(ctx) {
    super.draw(ctx);
  }

  updateLocation() {
    this._x += this.dx * this.speed;
    this._y += this.dy * this.speed;
  }

  collidesWith(object) {
    if(this.x < object.x + object.width && this.x + this.width > object.x && this.y < object.y + object.height && this.y + this.height > object.y && this !== object) {
      return true;
    } else {
      return false;
    }
  }
}
