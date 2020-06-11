// TODO: Update hitbox to match model size


export function Bullet(x, y, dx, dy, rotation) {
  this.x = x;
  this.y = y;
  this.height = 6;
  this.width = 29;
  this.rotation = rotation;
  this.dx = dx;
  this.dy = dy;
  this.speed = 2;
  this.alive = true;
  this.collided = false;
  this.bounces = 0;
  this.maxBounces = 4;
  this.explosionRadius = 0;
  this.explosionSpeed = 2;
  this.maxExplosionRadius = 20;
  this.explosionColor = "#ffa14a"
  let flipped = false;
  let counter = 0;
  let randomAnimation = 10 * Math.random();
  console.log(randomAnimation);

  this.draw = function(ctx, tile_sheet) {
    ctx.save();
    if(this.bounces > this.maxBounces || this.collided) {
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
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      counter++;
      if(counter > randomAnimation) {
        counter = 0;
        flipped = !flipped;
      }

      if(flipped) {
        ctx.drawImage(tile_sheet, 65, 0, this.width, this.height, -this.height/2, -this.height/2, this.width, this.height);
      } else {
        ctx.drawImage(tile_sheet, 65, 7, this.width, this.height, -this.height/2, -this.height/2, this.width, this.height);
      }

      ctx.restore();
    }
    ctx.restore();

  }
  this.update = function() {
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    if(this.x >= windowWidth - 3) {
      this.rotation = Math.PI - this.rotation;
      dx = -dx;
      this.bounces++;
    }
    if(this.x < 3) {
      this.rotation = Math.PI - this.rotation;
      dx = -dx;
      this.bounces++;
    }
    if(this.y > windowHeight  - 3) {
      this.rotation = -this.rotation;
      dy = -dy;
      this.bounces++;
    }
    if(this.y < 3) {
      this.rotation = -this.rotation;
      dy = -dy;
      this.bounces++;
    }
    this.x += dx * this.speed;
    this.y += dy * this.speed;
  }
}
