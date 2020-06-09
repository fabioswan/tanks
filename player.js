export function Player() {
  this.size = 20;
  this.style = "#004257";
  this.speed = 3;
  this.x = 10;
  this.y = 10;
  this.rotation = 0;
  this.mouse = [0,0];
  this.target = [0,0];

  this.velocity = {
    left: false,
    right: false,
    up: false,
    down: false,
  }

  this.turret = new Turret(20, this);

  this.rotate = function() {
    if(this.velocity.left) {
      this.target[0] = this.x - 50;
    }
    else if(this.velocity.right) {
      this.target[0] = this.x + 50;
    }
    else {
      this.target[0] = this.x + this.size/2;
    }
    if(this.velocity.up) {
      this.target[1] = this.y - 50;
    }
    else if(this.velocity.down) {
      this.target[1] = this.y + 50;
    }
    else {
      this.target[1] = this.y + this.size/2;
    }
    var dx = this.target[0]-this.x - this.size/2;
    var dy = this.target[1]-this.y - this.size/2;
    this.rotation = Math.atan2(dy, dx);
  
    
  }
}

Player.prototype.mouseMove = function(ev) {
  this.mouse[0] = ev.clientX;
  this.mouse[1] = ev.clientY;
  this.turret.rotate();
}


Player.prototype.draw = function(ctx, tile_sheet) {

  ////////////
  // BROKEN //
  ////////////

  ctx.save();

  //ctx.translate(100, 100);
  //ctx.rotate(0.4);
  
  ctx.fillStyle = "#000";
  ctx.fillRect(this.x-2, this.y+1, this.size+4, this.size-2);
  ctx.fillStyle = this.style;
  ctx.fillRect(this.x, this.y-2, this.size, this.size+4);
  ctx.restore();
  
  ctx.save();

  this.turret.draw(ctx);
  
};


Player.prototype.update = function(deltaTime) {
  if(this.velocity.left == true) {
    this.x -= this.speed;
    this.rotate();
  }
  if(this.velocity.right == true) {
    this.x += this.speed;
  }
  if(this.velocity.up == true) {
    this.y -= this.speed;
  }
  if(this.velocity.down == true) {
    this.y += this.speed;
  }
  this.turret.update();
};

function Turret(size, parent) {
  this.x = parent.x + parent.size/2 - size/8;
  this.y = parent.y + parent.size/2 - size/2;
  this.width = size/4;
  this.height = size;
  this.rotation;

  this.draw = function(ctx) {
    // Turret of Tank
    ctx.fillStyle = "#002d3b";
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.fillRect(this.width / -2, this.height / -6, this.width, this.height);
    ctx.restore();

    // Dome of Tank
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height/2, 8, 0, Math.PI*2);
    ctx.fillStyle = "#002d3b";
    ctx.fill();
    ctx.closePath()
    
  }
  this.update = function() {
    this.x = parent.x + parent.size/2 - size/8;
    this.y = parent.y + parent.size/2 - size/2;
    this.rotate();
  }

  this.rotate = function(rotation) {

    var dx = parent.mouse[0]-this.x - parent.size;
    var dy = parent.mouse[1]-this.y - parent.size/2;
    this.rotation = Math.atan2(-dx, dy);
  }
}
