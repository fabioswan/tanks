export function Engine(entities, update, render) {
  this.update = update;
  this.render = render;
  var pFrame = 0;
  ;(function() {
    function main( tFrame ) {
      Engine.stop = window.requestAnimationFrame(main);

      let deltaTime = pFrame - tFrame;
      update( deltaTime );
      render();
      pFrame = tFrame;
      
    }
    main();
  })();
}
