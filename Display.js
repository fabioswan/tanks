export function Display(entities, tiles) {
  var loaded = false;
  var ctx = document.getElementById("game").getContext("2d");
  var height = document.documentElement.clientHeight;
  var width = document.documentElement.clientWidth;
  var tile_sheet = new Image();
  tile_sheet.onload = function() {
    loaded = true;
    console.log("Loaded!");
  };
  tile_sheet.src = tiles;
  ctx.imageSmoothingEnabled = false;


  this.render = function() {
    if(loaded) {
      height = document.documentElement.clientHeight;
      width = document.documentElement.clientWidth;

      ctx.canvas.height = height;
      ctx.canvas.width = width;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      for (let entity of entities) {
        entity.draw(ctx, tile_sheet);
      }
    }
  }
}
