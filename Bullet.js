export function Bullet(x, y, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.speed = 8;
  this.alive = true;
  this.bounces = 0;
  this.maxBounces = 5;
  this.explosionRadius = 0;
  this.explosionSpeed = 2;
  this.maxExplosionRadius = 20;
  this.explosionColor = "#ffa14a"

  this.draw = function(ctx, tile_sheet) {
    if(this.bounces > this.maxBounces) {
      this.speed = 0;
      if(this.explosionRadius < this.maxExplosionRadius) {
        this.explosionRadius += this.explosionSpeed;
        ctx.fillStyle = this.explosionColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.explosionRadius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
      } else {
        this.alive = false;
      }
    } else {
      ctx.save();
      ctx.drawImage(tile_sheet, 65, 0, 8, 5, this.x, this.y, 8, 5);
      ctx.restore();
    }
  }
  this.update = function() {
    this.aliveTime++;
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    if(this.x > windowWidth) {
      this.x = windowWidth - 1
      dx = -dx;
      this.bounces++;
    }
    if(this.x < 0) {
      this.x = 1;
      dx = -dx;
      this.bounces++;
    }
    if(this.y > windowHeight) {
      this.y = windowHeight - 1
      dy = -dy;
      this.bounces++;
    }
    if(this.y < 0) {
      this.y = 1;
      dy = -dy;
      this.bounces++;
    }
    this.x += dx * this.speed;
    this.y += dy * this.speed;
  }
}
