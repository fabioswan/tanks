import {Controller} from './Controller.js';
import {Display} from './Display.js';
import {Engine} from './Engine.js';
import {Game} from './Game.js';

export class Main {
  constructor(images) {
    console.log("Starting!");
    /* The display handles window resizing */
    let display = new Display(images);
    /* The game will eventually hold our game logic. */
    let game = new Game();
    /* The engine is where the above three sections can interact. */
    new Engine(game,display);
    /* The controller handles user input. */
    new Controller(game,display);

  }

}
