import {Player} from './Player.js';
import {Enemy} from './Enemy.js';
import {Wall} from './Wall.js';

export class Game {
  constructor() {
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    /* List of entites to render/update */
    this.scale = 20;
    this.imageSize = 256;
    this.tileSize = 32;

    this.entities = [];
    this.bullets = [];
    this.walls = [];
    this.respawn = false;

    this.map =
    [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]

    for(let i=0; i<this.map.length; i++) {
      for(let j=0; j<this.map[i].length; j++) {
        if(this.map[j][i] == 1) {
          this.walls.push(new Wall(i*this.imageSize,j*this.imageSize,this.imageSize,this.imageSize));
        }

      }
    }



    this.player = new Player(3*this.imageSize,9*this.imageSize,this.imageSize,this);
    this.entities.push(new Enemy(16*this.imageSize,4*this.imageSize,this.imageSize,this));
    this.entities.push(new Enemy(16*this.imageSize,15*this.imageSize,this.imageSize,this));


    this.entities.push(this.player);
  }

  // TODO: Bullets method needs to be fixed


  update() {
    if(!this.player.alive && this.respawn) {
      this.reloadEngine = true;
      this.reloadController = true;
      this.respawn = false;
      this.alive = true
      this.player = new Player(100,100,32);
      this.entities.unshift(this.player);
    }

    // Update all walls
    for (let wall of this.walls) {
      wall.update();
    }


    // Update entities
    for (let i = 0; i<this.entities.length; i++) {
      let entity = this.entities[i];
      entity.update(this.entities);
      if(!entity.alive) {
        entity = null;
        this.entities.splice(i,1);
      }
    }

    // Update bullets
    for (let i = 0; i<this.bullets.length; i++)  {
      let bullet = this.bullets[i];
      bullet.update(this.walls,this.bullets,this.entities);
      if(!bullet.alive) {
        bullet = null;
        this.bullets.splice(i,1);
      }
    }
  }
}
