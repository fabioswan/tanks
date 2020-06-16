export function Engine(game,display) {
  ;(function() {
    function gameLoop( tFrame ) {
      Engine.stop = window.requestAnimationFrame(gameLoop);
      game.update();
      display.render(game);

    }
    gameLoop();
  })();
}
