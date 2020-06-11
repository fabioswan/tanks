import { Bullet } from './Bullet.js';
import { Turret } from './Turret.js';

export function Player() {
  this.size = 32; // Player size -- TODO: Replace with tileSize
  this.speed = 4; // Movement speed
  this.x = 300; // Spawn Location X
  this.y = 300; // Spawn Location Y
  this.moving = false;

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
  this.trackOffset = {
    x: null,
    y: null,
  }

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
    this.bullets.push(new Bullet(this.x+this.size/2 + (delta.x*23),this.y+this.size/2 + (delta.y*23),delta.x*this.speed,delta.y*this.speed,this.turret.rotation));
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

Player.prototype.touchEvent = function(ev) {
  this.mouse[0] = ev.touches[0].pageX;
  this.mouse[1] = ev.touches[0].pageY;
  this.turret.rotate();
}


Player.prototype.draw = function(ctx, tile_sheet) {
  // DEBUG Target Dot
  // ctx.fillRect(this.target[0], this.target[1], 2, 2);

  for(let track of this.tracks) {
    track.draw(ctx);
  }



  ctx.save();
  ctx.translate(this.x + this.size/2, this.y + this.size/2);
  ctx.rotate(this.rotation);
  ctx.drawImage(tile_sheet, 0, 0, 32, 32, 0 - this.size/2, 0 - this.size/2, 32, 32);
  ctx.restore();



  this.turret.draw(ctx, tile_sheet);

  for(let bullet of this.bullets) {
    bullet.draw(ctx, tile_sheet);
  }
};


Player.prototype.update = function(deltaTime) {
  var delta = {
    x: 0,
    y: 0,
  }
  this.moving = false;
  if(this.velocity.left === true) {
    delta.x = -1;
    this.moving = true;
    this.rotate();
  }
  if(this.velocity.right === true) {
    delta.x = 1;
    this.moving = true;
    this.rotate();
  }
  if(this.velocity.up === true) {
    delta.y = -1;
    this.moving = true;
    this.rotate();
  }
  if(this.velocity.down === true) {
    delta.y = 1;
    this.moving = true;
    this.rotate();
  }
  normalize(delta);


  this.tracks.push(new Track(this.x, this.y, this.rotation));




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

  for(let i=0; i<this.tracks.length; i++) {
    let track = this.tracks[i];
    track.update();
    if(this.tracks.length > track.maxTracks) {
      this.tracks.splice(i, 1);
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

    for (let j=0; j<this.bullets.length; j++) {
      if(i !== j
        && this.bullets[i].x > this.bullets[j].x && this.bullets[i].x < this.bullets[j].x + 20
        && this.bullets[i].y > this.bullets[j].y && this.bullets[i].y < this.bullets[j].y + 20
        ) {
        this.bullets[i].collided = true;
        this.bullets[j].collided = true;
      }
    }

    if(bullet.x > this.x && bullet.x < this.x+32 && bullet.y > this.y && bullet.y < this.y+32) {
      bullet.collided = true;
    }

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
  if (magnitude !== 0) {
    point.x = 1 * point.x / magnitude;
    point.y = 1 * point.y / magnitude;
  }
}

function Track(x, y, rotation) {
  this.x = x;
  this.y = y;
  this.rotation = rotation;
  this.aliveTime = 0;
  this.life = 10;
  this.width = 12;
  this.size = 5;
  this.maxTracks = 30;
  var alpha = 1;
  var alphaRate = 1/this.maxTracks;


  this.draw = function (ctx) {
    ctx.save();
    ctx.translate(x+16, y+16);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#333";
    ctx.globalAlpha = alpha;
    ctx.fillRect(-16, -this.width-2, this.size, this.size);
    ctx.fillRect(-16, this.width-2, this.size, this.size);
    ctx.restore();
    if(alpha >= 0) { alpha -= alphaRate; }
  }



  this.update = function() {
    //this.aliveTime++;
  }
}
