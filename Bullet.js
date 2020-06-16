import {Entity} from './Entity.js'

// TODO: Bullets not currently launching from the same spot as the gun

export class Bullet extends Entity {
  constructor(x,y,dx,dy,parent) {
    let width = 80;
    let height = 80;
    super(x,y,width,height);
    this.dx = dx;
    this.dy = dy;
    this.speed = 1.5; // Scaler of Player.bulletSpeed

    this.parent = parent;
    this.rotation = parent.turret.rotation;
    this.game = this.parent.game;
    this.bullets = this.parent.bullets
    this.walls = this.parent.walls;
    this.collided = false;
    this.alive = true;
    this.bounces = 0;
    this.maxBounces = 1;
    this.collisionSize = 20;
    this.explosionRadius = 0;
    this.explosionSpeed = 18;
    this.maxExplosionRadius = 128;
    this.explosionColor = "#ffa14a";
    this.counter = 0;
    this.flipped = false;
    this.counter = 0;
    this.randomAnimation = 10 * Math.random();


  }

  bounceOffWalls(walls) {
    for(let wall of this.walls) {
      // Collision on Left
      if(this.x - this.width/2 < wall.x + wall.width && this.x > wall.x && this.y > wall.y && this.y < wall.y + wall.height) {
        this.rotation = Math.PI - this.rotation;
        this.dx = -this.dx;
        this.bounces++;
      }
      // Collision on Right
      if(this.x + this.width/2 > wall.x && this.x < wall.x && this.y > wall.y && this.y < wall.y + wall.height) {
        this.rotation = Math.PI - this.rotation;
        this.dx = -this.dx;
        this.bounces++;
      }
      // Collision on Bottom
      if(this.y + this.height/2 > wall.y && this.y < wall.y && this.x > wall.x && this.x < wall.x + wall.width) {
        this.rotation = -this.rotation;
        this.dy = -this.dy;
        this.bounces++;
      }
      // Collision on Top
      if(this.y - this.height/2 < wall.y + wall.height && this.y > wall.y && this.x > wall.x && this.x < wall.x + wall.width) {
        this.rotation = -this.rotation;
        this.dy = -this.dy;
        this.bounces++;
      }
    }
  }

  checkCollision(bullets,entities) {
    for(let bullet of bullets) {
      if(this.collidesWith(bullet)) {
        this.collided = true;
        bullet.collided = true;
      }
    }
    for(let entity of entities) {
      if(this.collidesWith(entity)) {
        this.collided = true;
        entity.alive = false;
      }
    }
  }

  draw(ctx, tile_sheet, bullet) {
    ctx.save();
    if(this.bounces > this.maxBounces || this.collided) {
      this.speed = 0;
      if(this.explosionRadius < this.maxExplosionRadius) {
        this.explosionRadius += this.explosionSpeed;
        ctx.fillStyle = this.explosionColor;
        ctx.beginPath();
        ctx.arc(this._x, this._y, this.explosionRadius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
      } else {
        this.alive = false;
      }
    } else {
      ctx.translate(this._x, this._y);
      ctx.rotate(this.rotation);
      this.counter++;
      if(this.counter > this.randomAnimation) {
        this.counter = 0;
        this.flipped = !this.flipped;
      }
      ctx.drawImage(bullet, 0, 0, 256, 256, -this.height/2, -this.height/2, this.width, this.height);

      ctx.restore();
    }
    ctx.restore();
  }

  update(walls,bullets,entities) {
    super.update();
    this.bounceOffWalls(walls);
    this.checkCollision(bullets,entities);
  }
}
