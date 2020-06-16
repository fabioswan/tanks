export class Controller {
  constructor(game,display) {
    let player = game.player;
    let buffer = display.ctx;
    document.addEventListener("keyup", function(e) { keyUpHandler(e);}, false);
    document.addEventListener("keydown", function(e) { keyDownHandler(e);}, false);
    document.addEventListener('mousemove', function(e) { mouseMove(e);},false);

    document.addEventListener('mousedown', e => {
      player.shooting = true;
    });
    document.addEventListener('mouseup', e => {
      player.shooting = false;
    });
    document.addEventListener("touchstart", e => {
      player.shooting = true;
      //player.touchEvent(e);
    });
    document.addEventListener("touchmove", e => {
      //player.touchEvent(e);
    });
    document.addEventListener("touchend", e => {
      player.shooting = false;
    });

    var keyDownHandler = function(e) {
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

      // TODO: Fix respawn
      /*
      if(e.keyCode === 82) {
        game.respawn = true;
      }
      */
    }

    var keyUpHandler = function(e) {
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

    var mouseMove = function(e) {
      var rect = buffer.canvas.getBoundingClientRect();
      let scale = (game.imageSize*game.scale)/buffer.canvas.width;
      player.mouse[0] = (e.clientX - rect.left)*scale;
      player.mouse[1] = (e.clientY - rect.top)*scale;
    }
  }
}
