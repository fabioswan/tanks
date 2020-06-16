import {GameObject} from './GameObject.js';

export class Wall extends GameObject {
  constructor(x, y, width, height, tile) {
    super(x, y, width, height, tile);
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.fillStyle = "#222";
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}
