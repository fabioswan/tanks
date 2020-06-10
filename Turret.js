export function Turret(size, parent) {
  this.x = parent.x + parent.size/2 - size/8;
  this.y = parent.y + parent.size/2 - size/2;
  this.width = size/4;
  this.height = size;
  this.rotation = 0;

  this.draw = function(ctx, tile_sheet) {
    // Turret of Tank

    ctx.translate(this.x+2, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.drawImage(tile_sheet, 32, 0, 32, 32, -8.5, -15.5, 32, 32);
    ctx.restore();

  }
  this.update = function() {
    this.x = parent.x + parent.size/2 - size/8;
    this.y = parent.y + parent.size/2 - size/2;
    this.rotate();
  }

  this.rotate = function(rotation) {

    var dx = parent.mouse[0]-this.x;
    var dy = parent.mouse[1]-this.y - parent.size/2;
    this.rotation = Math.atan2(dy, dx);
  }
}
