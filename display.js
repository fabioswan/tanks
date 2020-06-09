import {Test} from './test.js';

export function Display(entities) {
  var ctx = document.getElementById("game").getContext("2d");
  var height = document.documentElement.clientHeight;
  var width = document.documentElement.clientWidth;
  var test = new Test();

  this.render = function() {
    height = document.documentElement.clientHeight;
    width = document.documentElement.clientWidth;

    ctx.canvas.height = height;
    ctx.canvas.width = width;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let entity of entities) {
      entity.draw(ctx);
    }
    // TEST CODE //
    test.draw(ctx);
  }
}