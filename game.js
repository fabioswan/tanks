

export function Game() {
}

Game.prototype.update = function(entities, deltaTime) {
  for (let entity of entities) {
    entity.update();
  }
}