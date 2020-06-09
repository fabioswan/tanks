export function Display(entities) {
  this.loaded = false;
  var ctx = document.getElementById("game").getContext("2d");
  var height = document.documentElement.clientHeight;
  var width = document.documentElement.clientWidth;
  var tile_sheet = new Image();
  console.log("Not Loaded");
  tile_sheet.onload = function() {
    this.loaded = true;
    ctx.drawImage(tile_sheet, 0, 0, 16, 16);
    console.log("Loaded");
  };
  tile_sheet.src = './assets/img/tankBody.png';


  this.render = function() {
    if(this.loaded) {
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