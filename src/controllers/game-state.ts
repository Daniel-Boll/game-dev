/*
 * game-state.ts
 *
 * This class is responsible for managing the state of the game.
 * For example it's responsible for keeping track if I'm at one specific game or the menu.
 *
 * */
import * as w4 from "../wasm4";
import { MetaGame } from "../meta-game";
import { Menu } from "../menu";

export enum GameStates {
  MENU,
  GAME,
  META_GAME,
}

export class GameLoop {
  public setup(): void {}
  public loop(): void {}
}

export class GameState {
  private static state: Map<GameStates, GameLoop> = new Map<
    GameStates,
    GameLoop
  >();
  private static timesCalled: Map<GameStates, u8> = new Map<GameStates, u8>();
  private static currentScene: GameStates;

  public static init(): void {
    this.state.set(GameStates.MENU, new Menu());
    this.state.set(GameStates.META_GAME, new MetaGame());

    this.currentScene = GameStates.MENU;
    this.getStateLoop().setup();

    this.timesCalled.set(GameStates.MENU, 1);
    this.timesCalled.set(GameStates.META_GAME, 0);
    this.timesCalled.set(GameStates.GAME, 0);
  }

  public static getState(): GameStates {
    return this.currentScene;
  }

  public static getStateLoop(): GameLoop {
    return this.state.get(this.currentScene);
  }

  public static getInfoOfState(state: GameStates): GameLoop {
    return this.state.get(state);
  }

  public static setState(state: GameStates): void {
    this.currentScene = state;
    if (!this.timesCalled.has(this.currentScene))
      return w4.trace(`game-state.setState:: Error trying to get scene`);

    const previousValue = this.timesCalled.get(this.currentScene);
    if (previousValue == 0) {
      this.getStateLoop().setup();
      this.timesCalled.set(this.currentScene, previousValue + 1);
    }
  }

  public static loop(): void {
    this.getStateLoop().loop();
  }
}
