import * as w4 from "../wasm4";

import { GameLoop } from "../controllers/game-state";
import { MetaGameState } from "./state";

export class MetaGame extends GameLoop {
  public setup(): void {
    MetaGameState.init();
  }

  public loop(): void {
    MetaGameState.loop();
  }
}

// import { EntityManager, EntityType, Enemy, Player, Ball } from "./entities";
// import { DialogUI, PowerUI, ScoreUI } from "./ui";
// import { Delayer } from "./utils/utils";
//
// const manager = EntityManager.getInstance();
// const delayer = Delayer.getInstance();
//
// const scoreUI = new ScoreUI();
// const dialogUI = new DialogUI();
// const powerUI = new PowerUI();
//
// export function start(): void {
//   (
//     manager.addEntity(EntityType.Player).addTag("player").create() as Player
//   ).setPosition(80 - 4, 160 - 30 - 4);
//
//   (
//     manager.addEntity(EntityType.Enemy).addTag("enemy").create() as Enemy
//   ).setPosition(80 - 4, 30 - 4);
//
//   scoreUI.setLevelMaxScore(30);
// }
//
// function updateEntities(): void {
//   // Entities
//   const player = <Player>manager.getEntityByTag("player");
//   const enemy = <Enemy>manager.getEntity(EntityType.Enemy);
//
//   player.update().draw();
//   enemy.update().draw();
//
//   const balls = manager.getEntities(EntityType.Ball);
//   balls.forEach((ball) => (ball as Ball).update().draw());
// }
//
// function updateEnvironment(): void {
//   store<u16>(w4.DRAW_COLORS, 4);
//   w4.hline(0, 80, 160);
// }
//
// let previousGamepad: u8 = 0;
// function updateUI(): void {
//   const gamepad = load<u8>(w4.GAMEPAD1);
//   const justPressed = gamepad & (gamepad ^ previousGamepad);
//
//   scoreUI.draw();
//   powerUI.draw();
//
//   if (justPressed & w4.BUTTON_2) {
//     dialogUI.setTitle("Hello").setMessages(["Hello", "World"]).open();
//   }
//   dialogUI.draw();
//
//   previousGamepad = gamepad;
// }
//
// export function update(): void {
//   updateEntities();
//   updateEnvironment();
//   updateUI();
//   delayer.update();
// }
