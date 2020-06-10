import { Bullet } from './Bullet.js';
import { Turret } from './Turret.js';

export function Player() {
  this.size = 32; // Player size -- TODO: Replace with tileSize
  this.speed = 4; // Movement speed
  this.x = 300; // Spawn Location X
  this.y = 300; // Spawn Location Y

  // TODO: Clean up rotation variables
  this.rotationSpeed = 0.1; // Sets the speed of tanks rotation
  this.prevRotation = 0;
  this.newRotation = 0;
  this.rotation = 0;


  this.mouse = [0,0]; // Mouse location
  this.target = [0,0];
  this.shooting = false;
  this.firerate = 10; // Larger number for slower fire rate... I should fix this at some point.
  this.firerateCounter = this.firerate; // Pretty sloppy counter to set the firerate
  this.bullets = [];
  this.tracks = [];

  this.velocity = {
    left: false,
    right: false,
    up: false,
    down: false,
  }

  this.turret = new Turret(20, this);

  this.shoot = function() {
    let delta = {
      x: this.mouse[0] - (this.x + this.size/2),
      y: this.mouse[1] - (this.y + this.size/2)
    }

    normalize(delta);
    // TODO: Fix bullet offset from turret
    // TODO: Rotate bullets!
    // TODO: Possibility to shoot own bullets!
    this.bullets.push(new Bullet(this.x+this.size/2 + (delta.x*25), this.y+this.size/2 + (delta.y*25), delta.x, delta.y));
  }


 // TODO: Fix this HORRIBLE function for tank rotation. There has to be a much cleaner way to do this.
  this.rotate = function() {
    this.prevRotation = this.rotation;
    if(this.velocity.left) {
      this.target[0] = this.x + (this.size/2) - 50;
    }
    else if(this.velocity.right) {
      this.target[0] = this.x + (this.size/2) + 50;
    }
    else {
      this.target[0] = this.x + this.size/2;
    }
    if(this.velocity.up) {
      this.target[1] = this.y + (this.size/2) - 50;
    }
    else if(this.velocity.down) {
      this.target[1] = this.y + (this.size/2) + 50;
    }
    else {
      this.target[1] = this.y + this.size/2;
    }


    var dx = this.target[0] - this.x - this.size/2;
    var dy = this.target[1] - this.y - this.size/2;
    this.newRotation = Math.atan2(dy, dx);
    let newRot = (this.newRotation).toPrecision(3);
    let prevRot = (this.prevRotation).toPrecision(3);

    let direction = 0;

    if(Math.abs(newRot) - Math.abs(prevRot) < 0.05 && Math.abs(newRot) - Math.abs(prevRot) > -0.05) {
      direction = 0;
    } else if((Math.abs(newRot) - (Math.abs(prevRot)+Math.PI) < 0.05 && Math.abs(newRot) - (Math.abs(prevRot)+Math.PI) > -0.05) ||
              ((Math.abs(newRot)+Math.PI) - Math.abs(prevRot) < 0.05 && (Math.abs(newRot)+Math.PI) - Math.abs(prevRot) > -0.05)) {
      direction = 0;
    } else {
      if(newRot - prevRot > 0) {
        if(newRot > 3 && (prevRot < -0.9)) {
          direction = -1;
        } else {
          direction = 1;
        }
      }
      if(newRot - prevRot < 0) {
        if(newRot < -1.5 && (prevRot > 2.5)) {
          if(prevRot > 3.13) {
            this.prevRotation = -3.1;
            this.rotation = -3.1;
            direction = 1;
          } else {
            direction = -1;
          }
        } else  {
          direction = -1;
        }
      }
    }


    this.changeRotation(direction);

    if(this.rotation > Math.PI) {
      this.rotation = Math.PI;
    }
    if(this.rotation < -Math.PI) {
      this.rotation = Math.PI;
    }
  }
}

Player.prototype.changeRotation = function(direction) {
  if( direction === -1 ) { this.rotation -= this.rotationSpeed; }
  if( direction === 0 ) { this.rotation = this.newRotation; }
  if( direction === 1 ) { this.rotation += this.rotationSpeed; }
}

Player.prototype.mouseMove = function(ev) {
  this.mouse[0] = ev.clientX;
  this.mouse[1] = ev.clientY;
  this.turret.rotate();
}


Player.prototype.draw = function(ctx, tile_sheet) {
  // DEBUG Target Dot
  // ctx.fillRect(this.target[0], this.target[1], 2, 2);

  ctx.save();
  ctx.translate(this.x + this.size/2, this.y + this.size/2);
  ctx.rotate(this.rotation);
  ctx.drawImage(tile_sheet, 0, 0, 32, 32, 0 - this.size/2, 0 - this.size/2, 32, 32);
  for(let track of this.tracks) {
    track.draw(ctx);
  }

  ctx.restore();



  for(let bullet of this.bullets) {
    bullet.draw(ctx, tile_sheet);
  }



  this.turret.draw(ctx, tile_sheet);

};


Player.prototype.update = function(deltaTime) {
  var delta = {
    x: 0,
    y: 0,
  }
  let moving = false;
  if(this.velocity.left === true) {
    delta.x = -1;
    moving = true;
    this.rotate();
  }
  if(this.velocity.right === true) {
    delta.x = 1;
    moving = true;
    this.rotate();
  }
  if(this.velocity.up === true) {
    delta.y = -1;
    moving = true;
    this.rotate();
  }
  if(this.velocity.down === true) {
    delta.y = 1;
    moving = true;
    this.rotate();
  }
  normalize(delta);

  console.log(this.tracks.length)
  if(moving) {
    this.tracks.push(new Track(0, 0));
  }



  //// TODO: Fix bouncy corners for tank.

  let windowWidth = document.documentElement.clientWidth - this.size;
  let windowHeight = document.documentElement.clientHeight - this.size;
  if(this.x > windowWidth) {
    this.x = windowWidth;
  }
  if(this.x <= 0) {
    this.x = 0;
  }
  if(this.y >= windowHeight) {
    this.y = windowHeight;
  }
  if(this.y <= 0) {
    this.y = 0;
  }

  delta.x *= this.speed;
  delta.y *= this.speed;
  this.x += delta.x;
  this.y += delta.y;

  for(let track of this.tracks) {
    track.update();
    if(track.life < track.aliveTime) {
      this.tracks.shift();
      track = null;
    }
  }
  if(this.shooting && this.firerateCounter > this.firerate) {
    this.shoot();
    this.firerateCounter = 0;
  }
  this.firerateCounter++;

  for (let i=0; i<this.bullets.length; i++) {
    let bullet = this.bullets[i];
    bullet.update();
    if(!bullet.alive) {
      this.bullets.splice(i, 1);
      bullet = null;
    }
  }

  this.turret.update();
};

function normalize(point) {
  var magnitude = Math.sqrt(point.x * point.x + point.y * point.y);
  if (magnitude != 0) {
    point.x = 1 * point.x / magnitude;
    point.y = 1 * point.y / magnitude;
  }
}

function Track(x, y) {
  this.x = x;
  this.y = y;
  this.aliveTime = 0;
  this.life = 100;



  this.draw = function(ctx) {
    ctx.fillStyle = "#333";
    ctx.fillRect(x-16, y+10, 5, 5);
    ctx.fillRect(x-16, y-15, 5, 5);
  //  ctx.fillRect(0 + 25, this.y, 5, 5);

  }
  this.update = function() {
    this.aliveTime++;
  }
}
