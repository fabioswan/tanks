import {Entity} from './Entity.js'
import {Turret} from './Turret.js'

export class Tank extends Entity {
  constructor(x, y, tileSize, game) {
    let width = tileSize;
    let height = tileSize;
    super(x,y,width,height);
    this.tileSize = tileSize;
    this.moving = false;
    this.speed = 8;

    this.rotationSpeed = 0.1;
    this.prevRotation = 0;
    this.newRotation = 0;
    this.rotation = 0;
    this.walls = game.walls;
    this.game = game;

    this.mouse = [0,0];
    this.target = [0,0];
    this.shooting = false;
    this.firerate = 10;

    this.mouse = [0,0]; // Mouse location
    this.target = [0,0];
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

    this.turret = new Turret(this._x, this._y, this.tileSize, this);

  }

  // Will go in player
  shoot() {
  }

   // TODO: Fix this HORRIBLE function for tank rotation. There has to be a much cleaner way to do this.
  rotate() {
    this.prevRotation = this.rotation;
    if(this.velocity.left) {
      this.target[0] = this._x + (this.width/2) - 50;
    }
    else if(this.velocity.right) {
      this.target[0] = this._x + (this.width/2) + 50;
    }
    else {
      this.target[0] = this._x + this.width/2;
    }
    if(this.velocity.up) {
      this.target[1] = this._y + (this.height/2) - 50;
    }
    else if(this.velocity.down) {
      this.target[1] = this._y + (this.height/2) + 50;
    }
    else {
      this.target[1] = this._y + this.height/2;
    }


    var dx = this.target[0] - this._x - this.width/2;
    var dy = this.target[1] - this._y - this.height/2;
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


  changeRotation = function(direction) {
    if( direction === -1 ) { this.rotation -= this.rotationSpeed; }
    if( direction === 0 ) { this.rotation = this.newRotation; }
    if( direction === 1 ) { this.rotation += this.rotationSpeed; }
  }

  normalize(point) {
    var magnitude = Math.sqrt(point.x * point.x + point.y * point.y);
    if (magnitude !== 0) {
      point.x = 1 * point.x / magnitude;
      point.y = 1 * point.y / magnitude;
    }
  }

  update() {
    super.update();
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
    this.normalize(delta);

    this.dx = delta.x;
    this.dy = delta.y;

    this.tracks.push(new Track(this._x, this._y, this.tileSize, this.rotation));

    let windowWidth = (this.game.imageSize*this.game.scale) - this.width;
    let windowHeight = (this.game.imageSize*this.game.scale) - this.height;
    if(this._x > windowWidth) {
      this._x = windowWidth;
    }
    if(this._x <= 0) {
      this._x = 0;
    }
    if(this._y >= windowHeight) {
      this._y = windowHeight;
    }
    if(this._y <= 0) {
      this._y = 0;
    }

    for(let wall of this.walls) {
      if(this.collidesLeft(wall,25)) { this._x = wall.x + wall.width }
      if(this.collidesRight(wall,25)) { this._x = wall.x - this.width }
      if(this.collidesTop(wall,25)) { this._y = wall.y + wall.height }
      if(this.collidesBot(wall,25)) { this._y = wall.y - this.height }
    }

    for(let i=0; i<this.tracks.length; i++) {
      let track = this.tracks[i];
      track.update();
      if(this.tracks.length > track.maxTracks) {
        this.tracks.splice(i, 1);
        track = null;
      }
    }

    this.turret.update(this._x, this._y);

  }

  draw(ctx, tank, turret) {

    for(let track of this.tracks) {
      track.draw(ctx);
    }



    ctx.save();
    ctx.translate(this._x+this.width/2, this._y+this.height/2);
    ctx.rotate(this.rotation);
    ctx.drawImage(tank, 0, 0, 256, 256, -this.height/2, -this.height/2, this.width, this.height);
    ctx.restore();

    this.turret.draw(ctx, turret, this.type);
  }
}

function Track(x, y, tankSize, rotation) {
  this._x = x;
  this._y = y;
  this.rotation = rotation;
  this.aliveTime = 0;
  this.life = 100;
  this.tankSize = tankSize;
  this.size = 40;
  this.maxTracks = 30;
  var alpha = 1;
  var alphaRate = 1/this.maxTracks;


  this.draw = function (ctx) {
    ctx.save();
    ctx.translate(x+this.tankSize/2, y+this.tankSize/2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#333";
    ctx.globalAlpha = alpha;
    ctx.fillRect(-this.tankSize/2+this.size/2, this.tankSize/2-(this.size*1.7), this.size, this.size);
    ctx.fillRect(-this.tankSize/2+this.size/2, -this.tankSize/2+(this.size*0.7), this.size, this.size);
    ctx.restore();
    if(alpha >= 0) { alpha -= alphaRate; }
  }



  this.update = function() {
    //this.aliveTime++;
  }
}
