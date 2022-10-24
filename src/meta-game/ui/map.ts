import { GameState, GameStates } from "../../controllers";
import { Menu } from "../../menu";
import { Position } from "../../utils/structures";
import { isMouseOver } from "../../utils/ui";
import { Delayer } from "../../utils/utils";
import { MetaGameLoop, MetaGameState, MetaGameStates } from "../state";
import * as w4 from "../wasm4";
import { Palette, PaletteType } from "./palette";
import {
  playLevelNotAvailable,
  playLevelSelection,
  playMapTransitionSound,
} from "./sound";

class Transition {
  button: u8;
  goto: i8;
}

class Level {
  levelId: u8;
  position: Position<i32>;
  difficulty: u8;
  transition: Array<Transition>;
}

// chest
const chestWidth = 8;
const chestHeight = 8;
const chestFlags = 1; // BLIT_2BPP
const chest = memory.data<u8>([
  0xfa, 0xab, 0xf8, 0x19, 0xf0, 0x09, 0xc0, 0x0b, 0xaa, 0xab, 0x91, 0x9b, 0x95,
  0x9b, 0xaa, 0xaf,
]);

export class Map extends MetaGameLoop {
  private currentLevel: u8 = 0;
  private levels: Array<Level> = [];
  private levelAvailable: u8 = 0;

  private inTransition: boolean = false;
  private playerPosition: Position<f32> = { x: 0, y: 0 };
  private delta: f32[] = [0, 0];

  private previousGamepad: u8 = 0;
  private frameCount: i32 = 0;

  private isMouseOverShop: boolean = false;
  private previousStateMouse: u8 = 0;

  public getCurrentLevel(): u8 {
    return this.currentLevel;
  }

  public setup(): void {
    (<Menu>GameState.getInfoOfState(GameStates.MENU)).getDifficulty() == "easy"
      ? (this.levelAvailable = 5)
      : (this.levelAvailable = 0);

    this.levels.push({
      levelId: 0,
      difficulty: 1,
      position: { x: 10, y: 10 },
      transition: [{ button: w4.BUTTON_RIGHT, goto: +1 }],
    });
    this.levels.push({
      levelId: 1,
      difficulty: 1,
      position: { x: 140, y: 10 },
      transition: [
        { button: w4.BUTTON_LEFT, goto: -1 },
        { button: w4.BUTTON_DOWN, goto: +1 },
      ],
    });
    this.levels.push({
      levelId: 2,
      difficulty: 2,
      position: { x: 140, y: 80 },
      transition: [
        { button: w4.BUTTON_UP, goto: -1 },
        { button: w4.BUTTON_LEFT, goto: +1 },
      ],
    });
    this.levels.push({
      levelId: 2,
      difficulty: 2,
      position: { x: 10, y: 80 },
      transition: [
        { button: w4.BUTTON_RIGHT, goto: -1 },
        { button: w4.BUTTON_DOWN, goto: +1 },
      ],
    });
    this.levels.push({
      levelId: 3,
      difficulty: 3,
      position: { x: 10, y: 145 },
      transition: [{ button: w4.BUTTON_UP, goto: -1 }],
    });

    this.playerPosition = {
      x: <f32>this.levels[this.currentLevel].position.x + 4,
      y: <f32>this.levels[this.currentLevel].position.y + 4,
    };
  }

  public getLevelAvailable(): u8 {
    return this.levelAvailable;
  }

  public newLevel(): void {
    // Current level + 1 is available
    if (this.levelAvailable < this.currentLevel + 1)
      this.levelAvailable = this.currentLevel + 1;
  }

  public loop(): void {
    for (let i = 0; i < this.levels.length; i++) {
      let level = this.levels[i];
      store<u16>(w4.DRAW_COLORS, level.difficulty);
      w4.oval(level.position.x, level.position.y, 10, 10);
    }

    // Draw the "player"
    store<u16>(w4.DRAW_COLORS, 4);
    w4.rect(<i32>this.playerPosition.x, <i32>this.playerPosition.y, 3, 3);

    this.checkMouseOverShop();
    store<u16>(w4.DRAW_COLORS, this.isMouseOverShop ? 0x1234 : 0x1432);
    w4.blit(chest, 80, 40, chestWidth, chestHeight, chestFlags);

    if (this.frameCount < 10) {
      this.frameCount++;
      return;
    }
    this.logic();
  }

  private checkMouseOverShop(): void {
    const mouse = load<u8>(w4.MOUSE_BUTTONS);
    const justClicked = mouse & (mouse ^ this.previousStateMouse);

    this.isMouseOverShop = isMouseOver(80, 80 + 16, 40, 40 + 16);

    if (justClicked & w4.MOUSE_LEFT && this.isMouseOverShop)
      MetaGameState.setState(MetaGameStates.SHOP);

    this.previousStateMouse = mouse;
  }

  private logic(): void {
    const gamepad = load<u8>(w4.GAMEPAD1);
    const justPressed = gamepad & (gamepad ^ this.previousGamepad);

    if (this.inTransition) {
      this.playerPosition.x += this.delta[0];
      this.playerPosition.y += this.delta[1];

      if (
        this.compareWithEpsilon(
          this.playerPosition.x,
          <f32>this.levels[this.currentLevel].position.x + 4
        ) &&
        this.compareWithEpsilon(
          this.playerPosition.y,
          <f32>this.levels[this.currentLevel].position.y + 4
        )
      ) {
        this.inTransition = false;
      }

      return;
    }

    if (justPressed & w4.BUTTON_1) {
      // Enter the level this.currentLevel
      playLevelSelection();
      MetaGameState.setState(MetaGameStates.BATTLE);
    }

    for (let i = 0; i < this.levels[this.currentLevel].transition.length; i++) {
      let transition = this.levels[this.currentLevel].transition[i];
      if (justPressed & transition.button) {
        const nextLevel = this.currentLevel + transition.goto;
        if (this.levelAvailable >= nextLevel) {
          this.transitionToLevel(this.currentLevel + transition.goto);
          this.inTransition = true;
          playMapTransitionSound();
        } else {
          playLevelNotAvailable();
        }
      }
    }

    this.previousGamepad = gamepad;
  }

  private compareWithEpsilon(a: f32, b: f32): boolean {
    return Math.abs(a - b) < 0.8;
  }

  private transitionToLevel(levelId: u8): void {
    const previousLevel = this.currentLevel;
    this.currentLevel = levelId;

    // Calculate an delta X to move player from current position to next level
    this.delta[0] = <f32>(
      (this.levels[this.currentLevel].position.x -
        this.levels[previousLevel].position.x)
    );

    // Calculate an delta Y to move player from current position to next level
    this.delta[1] = <f32>(
      (this.levels[this.currentLevel].position.y -
        this.levels[previousLevel].position.y)
    );

    // Normalize the delta
    const length = Math.sqrt(
      this.delta[0] * this.delta[0] + this.delta[1] * this.delta[1]
    );
    this.delta[0] /= <f32>length;
    this.delta[1] /= <f32>length;

    // Accelerate the delta
    this.delta[0] *= 1.5;
    this.delta[1] *= 1.5;
  }
}
