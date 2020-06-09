export function Test() {
  this.x = 10;
  this.y = 50;
}

Test.prototype.update = function (canvas) {
  //this.x += 5;
  if(this.x > canvas.width) {
    this.x = 0;
  }
}

Test.prototype.draw = function(ctx) {
  ctx.fillStyle = "#FFF";
  ctx.save();
  ctx.rotate(0.4);
  ctx.fillRect(this.x, this.y, 10, 10);
  ctx.rotate(-0.4);
  ctx.restore();
}