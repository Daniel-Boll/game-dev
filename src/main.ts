import { GameState } from "./controllers";
import { Delayer } from "./utils/utils";

const delayer = Delayer.getInstance();

export function start(): void {
  GameState.init();
}

export function update(): void {
  GameState.loop();
  delayer.update();
}
