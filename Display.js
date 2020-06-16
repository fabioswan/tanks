export class Display {
  constructor(images) {
    this.loaded = false;
    this.ctx = document.getElementById("game").getContext("2d");
    this.height = document.documentElement.clientHeight;
    this.width = document.documentElement.clientWidth;
    this.buffer = document.createElement("canvas").getContext("2d");


    this.bullet = new Image();
    this.bullet.src = images.bullet;
    let greenTank = new Image();
    greenTank.src = images.greenTank;
    let greenTurret= new Image();
    greenTurret.src = images.greenTurret;
    let playerTank = new Image();
    playerTank.src = images.playerTank;
    let playerTurret = new Image();
    playerTurret.src = images.playerTurret;

    this.images = {
      playerTank: playerTank,
      playerTurret: playerTurret,
      greenTank: greenTank,
      greenTurret: greenTurret,
    };

    this.isLoaded();

    this.scale = 20;
    this.imageSize = 32;

    this.buffer.canvas.height = this.imageSize * this.scale;
    this.buffer.canvas.width = this.imageSize * this.scale;
    this.buffer.imageSmoothingEnabled = false;
    this.buffer.imageSmoothingEnabled = false;
  }

  isLoaded() {
    console.log("Loaded!")
    this.loaded = true;
  }

  render(game) {
    this.scale = game.scale;
    this.imageSize = game.imageSize;

    if(this.loaded) {
      this.height = document.documentElement.clientHeight;
      this.width = document.documentElement.clientWidth;

      if(this.width > this.height) {
        this.ctx.canvas.height = this.height;
        this.ctx.canvas.width = this.height;
      } else {
        this.ctx.canvas.height = this.width;
        this.ctx.canvas.width = this.width;
      }

      this.buffer.canvas.height = this.imageSize * this.scale;
      this.buffer.canvas.width = this.imageSize * this.scale;
      this.buffer.imageSmoothingEnabled = false;

      //this.buffer.clearRect(0, 0, 3200, 1600);
      this.buffer.fillStyle = "#3b3b3b";
      this.buffer.fillRect(0, 0, this.buffer.canvas.height, this.buffer.canvas.width);

      // Draw Walls
      for (let wall of game.walls) {
        wall.draw(this.buffer, this.tile_sheet);
      }

      // Draw Entities
      for (let entity of game.entities) {
        entity.draw(this.buffer, this.images);
      }

      // Draw Bullets
      for(let bullet of game.bullets) {
        bullet.draw(this.buffer, this.tile_sheet, this.bullet);
      }

      this.ctx.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }
}
