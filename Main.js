import {Controller} from './Controller.js';
import {Display} from './Display.js';
import {Engine} from './Engine.js';
import {Game} from './Game.js';
import {Player} from './Player.js';

export function Main(tile_sheet) {
  console.log("Starting!")

  this.tile_sheet = tile_sheet;

  var render = function() {
    display.render();
  };

  var update = function(deltaTime) {
    game.update(entities, deltaTime);
  };

  /* List of entites to render/update */
  var entities = [];
  var player = new Player();

  entities.push(player);
  /* The controller handles user input. */
  var controller = new Controller(player);
  /* The display handles window resizing */
  var display = new Display(entities, tile_sheet);
  /* The game will eventually hold our game logic. */
  var game = new Game();
  /* The engine is where the above three sections can interact. */
  var engine = new Engine(entities, render, update);


  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  // Passing addEventListener like below allows this.variable to still work!
  document.addEventListener('mousemove', function(e) { player.mouseMove(e);},false);

  document.addEventListener('mousedown', e => {
    player.shooting = true;
  });
  document.addEventListener('mouseup', e => {
    player.shooting = false;
  });

  function keyDownHandler(e) {
    if(e.keyCode === 68 || e.key === "ArrowRight") {
      player.velocity.right = true;
    }
    if(e.keyCode === 65 || e.key === "ArrowLeft") {
      player.velocity.left = true;
    }
    if(e.keyCode === 83 || e.key === "ArrowDown") {
      player.velocity.down = true;
    }
    if(e.keyCode === 87  || e.key === "ArrowUp") {
      player.velocity.up = true;
    }
  }

  function keyUpHandler(e) {
    if(e.keyCode === 68 || e.key === "ArrowRight") {
      player.velocity.right = false;
    }
    if(e.keyCode === 65 || e.key === "ArrowLeft") {
      player.velocity.left = false;
    }
    if(e.keyCode === 83 || e.key === "ArrowDown") {
      player.velocity.down = false;
    }
    if(e.keyCode === 87 || e.key === "ArrowUp") {
      player.velocity.up = false;
    }
  }

}
