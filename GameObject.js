export class GameObject {
  constructor(x, y, width, height) {
    this._x      = x;
    this._y      = y;
    this.width  = width;
    this.height = height;
    this.bounds = {
      topL: [this._x,              this._y],
      topR: [this._x + this.width, this._y],
      botL: [this._x,              this._y + this.height],
      botR: [this._x + this.width, this._y + this.height],
    }
    this.location    = {
      x: this._x,
      y: this._y,
    }
    this.centeredLocation = {
      x: this._x + this.width/2,
      y: this._y + this.height/2,
    }
    this.collisionBoxSize = 5;

  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
    this.update();
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
    this.update();
  }
  set location(locaiton) {
    // this.location = location;
    // this._x = location.x;
    // this._y = locaiton.y;
  }

  update() {
    this.updateBounds();
    this.centerLocation();
  }

  draw(ctx) {

  }

  updateBounds() {
    this.bounds = {
      topL: [this._x,              this._y],
      topR: [this._x + this.width, this._y],
      botL: [this._x,              this._y + this.height],
      botR: [this._x + this.width, this._y + this.height],
    }
  }

  contains(x,y) {
    if(x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
      return true;
    }
  }

  collidesLeft(object,buffer){
    if(this.x < object.x + object.width && this.x > object.x && this.y + this.height - buffer > object.y && this.y + buffer < object.y + object.height) {
      return true;
    }
  }
  collidesRight(object,buffer){
    if(this.x + this.width > object.x && this.x < object.x && this.y + this.height - buffer > object.y && this.y + buffer < object.y + object.height) {
      return true;
    }
  }
  collidesTop(object,buffer){
    if(this.y < object.y + object.height && this.y > object.y && this.x + this.width - buffer > object.x && this.x + buffer < object.x + object.width) {
      return true;
    }
  }
  collidesBot(object,buffer){
    if(this.y + this.height > object.y && this.y < object.y && this.x + this.width - buffer > object.x && this.x + buffer < object.x + object.width) {
      return true;
    }
  }

  centerLocation() {
    this.centeredLocation = {
      x: this._x + this.width/2,
      y: this._y + this.height/2,
    }
  }
}
