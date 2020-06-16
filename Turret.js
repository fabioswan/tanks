import {GameObject} from './GameObject.js'

export class Turret extends GameObject {
  constructor(x,y,tileSize,parent) {
    let width = tileSize;
    let height = tileSize;
    super(x,y,width,height);
    this.rotation = 0;
    this.mouse = parent.mouse;
    this.walls = parent.walls;
    this.parent = parent;
    this._x = x;
    this._y = y;
  }

  rotate() {
    var dx = this.mouse[0]-this._x - this.width/2;
    var dy = this.mouse[1]-this._y - this.height/2;
    this.rotation = Math.atan2(dy, dx);
  }

  update(x,y) {
    super.update();
    this._x = x;
    this._y = y;
    this.rotate();
  }

  draw(ctx, image, type) {
    this.image = image;

    // TODO: Fix Aim Line
    if(this.parent.type == "Player") {
      this.lineOfSite(ctx);
    }


    // Turret of Tank
    ctx.save();
    ctx.translate(this._x + this.width/2, this._y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.image, 0, 0, 256, 256, -this.width/4, -this.height/2, this.width, this.height);
    ctx.restore();

  }

  // TODO: Consolidate with enemies lineOfSite

  lineOfSite(ctx) {
    var mouse = this.mouse;
    var walls = this.parent.walls;
    var object = this;
    this.ctx = ctx;

    let dotSize = 6;

    let targetX = this.mouse[0];
    let targetY = this.mouse[1];
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

    this.ctx.fillStyle = "#42f5f2";

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
          checkWalls();
          if(hasLineOfSite && x%100==0) {
            this.ctx.fillRect(predictionX+this.centeredLocation.x-dotSize/2,predictionY+this.centeredLocation.y-dotSize/2,dotSize,dotSize);
          }
        }
      } else {
        slopeX = distanceToTarget.x / distanceToTarget.x;
        slopeY = distanceToTarget.y / distanceToTarget.x;
        for(let x=0; x>distanceToTarget.x; x--) {
          predictionX -= slopeX;
          predictionY -= slopeY;
          checkWalls();
          if(hasLineOfSite && x%100==0) {
            this.ctx.fillRect(predictionX+this.centeredLocation.x-dotSize/2,predictionY+this.centeredLocation.y-dotSize/2,dotSize,dotSize);
          }
        }
      }
    } else {
      slopeX = distanceToTarget.x / distanceToTarget.y;
      slopeY = distanceToTarget.y / distanceToTarget.y;
      if(distanceToTarget.y>0) {
        for(let y=0; y<distanceToTarget.y; y++) {
          predictionX += slopeX;
          predictionY += slopeY;
          checkWalls();
          if(hasLineOfSite && y%100==0) {
            this.ctx.fillRect(predictionX+this.centeredLocation.x-dotSize/2,predictionY+this.centeredLocation.y-dotSize/2,dotSize,dotSize);
          }
        }
      } else {
        for(let y=0; y>distanceToTarget.y; y--) {
          predictionX -= slopeX;
          predictionY -= slopeY;
          checkWalls();
          if(hasLineOfSite && y%100==0) {
            this.ctx.fillRect(predictionX+this.centeredLocation.x-dotSize/2,predictionY+this.centeredLocation.y-dotSize/2,dotSize,dotSize);
          }
        }
      }
    }
    return hasLineOfSite;
  }


}
