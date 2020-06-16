import { Tank } from './Tank.js';
import {Bullet} from './Bullet.js'


export class Enemy extends Tank {
  constructor(x,y,tileSize,game) {
    let width = tileSize;
    let height = tileSize;
    super(x,y,tileSize,game);
    this.target = game.player;
    this.walls = game.walls;
    this.bullets = game.bullets;
    this.entites = game.entities;
    this.type = "Green";

    this.shooting = false;
    this.bulletSpeed = 21;
    this.fireRate = 100;
    this.counter = 0;
  }

  update(entities) {
    super.update();
    this.entities = entities;
    this.aim();
    this.shoot();
  }

  // TODO: MAKE THIS WORK

  lineOfSite() {
    var target = this.target;
    var entities = this.entities
    var walls = this.walls;
    var object = this;

    let targetX = this.target.centeredLocation.x;
    let targetY = this.target.centeredLocation.y;
    let lineOfSiteX = true;
    let lineOfSiteY = true;
    let distanceToTarget = {
      x: targetX - this.centeredLocation.x,
      y: targetY - this.centeredLocation.y,
    };

    let slopeX, slopeY;
    let hasLineOfSite = true;
    let predictionX = 0;
    let predictionY = 0;

    function checkEntities() {
      for(let entity of entities) {
        if(entity !== target && entity !== object) {
          if(entity.contains(predictionX+object.centeredLocation.x,predictionY+object.centeredLocation.y)) {
            hasLineOfSite = false;
          }
        }
      }
    }

    function checkWalls() {
      for(let wall of walls) {
        if(wall.contains(predictionX+object.centeredLocation.x,predictionY+object.centeredLocation.y)) {
          hasLineOfSite = false;
        }
      }
    }



    if(Math.abs(distanceToTarget.x) > Math.abs(distanceToTarget.y)) {
      if(distanceToTarget.x > 0) {
        slopeX = distanceToTarget.x / distanceToTarget.x;
        slopeY = distanceToTarget.y / distanceToTarget.x;
        for(let x=0; x<distanceToTarget.x; x++) {
          predictionX += slopeX;
          predictionY += slopeY;
          checkEntities();
          checkWalls();
          //this.ctx.fillRect(predictionX+this.centeredLocation.x,predictionY+this.centeredLocation.y,1,1);
        }
      } else {
        slopeX = distanceToTarget.x / distanceToTarget.x;
        slopeY = distanceToTarget.y / distanceToTarget.x;
        for(let x=0; x>distanceToTarget.x; x--) {
          predictionX -= slopeX;
          predictionY -= slopeY;
          checkEntities();
          checkWalls();
          //this.ctx.fillRect(predictionX+this.centeredLocation.x,predictionY+this.centeredLocation.y,1,1);
        }
      }
    } else {
      slopeX = distanceToTarget.x / distanceToTarget.y;
      slopeY = distanceToTarget.y / distanceToTarget.y;
      if(distanceToTarget.y>0) {
        for(let y=0; y<distanceToTarget.y; y++) {
          predictionX += slopeX;
          predictionY += slopeY;
          checkEntities();
          checkWalls();
          //this.ctx.fillRect(predictionX+this.centeredLocation.x,predictionY+this.centeredLocation.y,1,1);
        }
      } else {
        for(let y=0; y>distanceToTarget.y; y--) {
          predictionX -= slopeX;
          predictionY -= slopeY;
          checkEntities();
          checkWalls();
          //this.ctx.fillRect(predictionX+this.centeredLocation.x,predictionY+this.centeredLocation.y,1,1);
        }
      }
    }
    return hasLineOfSite;
  }

  draw(ctx, images) {
    switch(this.type) {
      case "Green":
        super.draw(ctx, images.greenTank, images.greenTurret);
        break;
    }
  }


  shoot() {
    if(this.lineOfSite()) {
      if(this.counter <= this.fireRate) { this.counter ++; }
      if(this.counter >= this.fireRate) {
        this.shooting = true;
        if(this.shooting && this.target.alive) {
          let delta = {
            x: this.target.centeredLocation.x- (this.x + this.width/2),
            y: this.target.centeredLocation.y - (this.y + this.height/2)
          }

          this.normalize(delta);


          this.bullets.push(new Bullet(this._x+this.width/2 + (delta.x*256),this._y+this.height/2 + (delta.y*256),delta.x*this.bulletSpeed,delta.y*this.bulletSpeed,this));
          this.counter = 0;
        }
      }
    }
  }

  aim(target) {
    this.mouse[0] = this.target.centeredLocation.x;
    this.mouse[1] = this.target.centeredLocation.y;
    this.turret.rotate();
  }


}
