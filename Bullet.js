// TODO: There seems to be an issue causing random bullets to delete prematurely.
//       I've only noticed it when there are quite a few scattered bullets in play.
//       OH! The issue is how I am using bullets.shift() in Player.js. If a bullet
//       that was created later bounces more times, it'll delete one younger than itself.
//       I plan to address it when rewriting how these functions share properties.

export function Bullet(x, y, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.speed = 8;
  this.aliveTime = 0;
  this.bounces = 0;
  this.maxBounces = 5;

  this.draw = function(ctx, tile_sheet) {
    ctx.save();
    ctx.drawImage(tile_sheet, 65, 0, 8, 5, this.x, this.y, 8, 5);
    ctx.restore();

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
