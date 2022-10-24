/*
 * game-state.ts
 *
 * This class is responsible for managing the state of the game.
 * For example it's responsible for keeping track if I'm at one specific game or the menu.
 *
 * */
import { Battle } from "../battle";
import { Shop } from "../shop/shop";
import { Map as MapGameLoop } from "../ui/map";
import * as w4 from "../wasm4";

export enum MetaGameStates {
  MAP,
  BATTLE,
  SHOP,
}

export class MetaGameLoop {
  public setup(): void {}
  public loop(): void {}
}

export class MetaGameState {
  private static state: Map<MetaGameStates, MetaGameLoop> = new Map<
    MetaGameStates,
    MetaGameLoop
  >();
  private static timesCalled: Map<MetaGameStates, u8> = new Map<
    MetaGameStates,
    u8
  >();
  private static currentScene: MetaGameStates;

  public static init(): void {
    this.state.set(MetaGameStates.MAP, new MapGameLoop());
    this.state.set(MetaGameStates.BATTLE, new Battle());
    this.state.set(MetaGameStates.SHOP, new Shop());

    this.currentScene = MetaGameStates.MAP;
    this.getStateLoop().setup();

    this.timesCalled.set(MetaGameStates.MAP, 1);
    this.timesCalled.set(MetaGameStates.BATTLE, 0);
    this.timesCalled.set(MetaGameStates.SHOP, 0);
  }

  public static getState(): MetaGameStates {
    return this.currentScene;
  }

  public static getStateLoop(): MetaGameLoop {
    return this.state.get(this.currentScene);
  }

  public static getInfoOfState(state: MetaGameStates): MetaGameLoop {
    return this.state.get(state);
  }

  public static setState(state: MetaGameStates): void {
    this.currentScene = state;
    if (!this.timesCalled.has(this.currentScene))
      return w4.trace(`game-state.setState:: Error trying to get scene`);

    const previousValue = this.timesCalled.get(this.currentScene);
    if (previousValue == 0) {
      this.getStateLoop().setup();

      // I want every battle/shop to get to the setup function
      if (state != MetaGameStates.BATTLE && state != MetaGameStates.SHOP)
        this.timesCalled.set(this.currentScene, previousValue + 1);
    }
  }

  public static loop(): void {
    this.getStateLoop().loop();
  }
}
