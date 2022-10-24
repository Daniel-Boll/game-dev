import * as w4 from "../wasm4";

import { Ball, Enemy, EntityManager, EntityType, Player } from "../entities";
import { MetaGameLoop, MetaGameState, MetaGameStates } from "../state";
import {
  IceCreamGBPalette,
  LevelEndUI,
  Palette,
  PaletteType,
  PowerUI,
  ScoreUI,
} from "../ui";
import { Map as MapGameLoop } from "../ui/map";
import { Delayer } from "../../utils/utils";

const manager = EntityManager.getInstance();

let scoreUI: ScoreUI;
let levelEnd: LevelEndUI;
let powerUI: PowerUI;

export class Battle extends MetaGameLoop {
  private previousGamepad: u8 = 0;
  private level: u8 = 0;
  private maxScorePerLevel: u8[] = [
    5,
    15, // Level 2
    30, // Level 3
    30, // Level 4
    50, // Level 5
  ];
  private palettePerLevel: PaletteType[] = [
    PaletteType.GAMEBOY,
    PaletteType.ICECREAM,
    PaletteType.NEONNIGHTSKY,
    PaletteType.REDBLOODPAIN,
    PaletteType.REDISDEAD,
  ];
  private endGame: boolean = false;

  public setup(): void {
    manager.resetStates();
    this.endGame = false;
    levelEnd = new LevelEndUI();
    powerUI = new PowerUI();
    scoreUI = new ScoreUI();

    this.level = (<MapGameLoop>(
      MetaGameState.getInfoOfState(MetaGameStates.MAP)
    )).getCurrentLevel();

    (manager.addEntity(EntityType.Player).addTag("player").create() as Player)
      .setPosition(80 - 4, 160 - 30 - 4)
      .setSpeedByLevel(this.level);

    (manager.addEntity(EntityType.Enemy).addTag("enemy").create() as Enemy)
      .setPosition(80 - 4, 30 - 4)
      .setLevel(this.level);

    scoreUI.setLevelMaxScore(this.maxScorePerLevel[this.level]);

    Palette.getInstance().useColor(this.palettePerLevel[this.level]);
  }

  public loop(): void {
    this.updateEntities();
    this.updateEnvironment();
    this.updateUI();
  }

  private updateEntities(): void {
    // Entities
    const player = <Player>manager.getEntityByTag("player");
    const enemy = <Enemy>manager.getEntity(EntityType.Enemy);

    if (player.getScore() >= this.maxScorePerLevel[this.level]) {
      this.endGame = true;
    }
    if (enemy.getScore() >= this.maxScorePerLevel[this.level]) {
      this.endGame = true;
    }

    if (this.endGame) {
      levelEnd.open(
        this.level,
        player.getScore() - enemy.getScore(),
        this.maxScorePerLevel[this.level]
      );
    } else {
      player.update();
      enemy.update();
    }

    player.draw();
    enemy.draw();

    const balls = manager.getEntities(EntityType.Ball);
    for (let idx = 0; idx < balls.length; idx++) {
      const ball = <Ball>balls[idx];
      if (!this.endGame) ball.update();
      ball.draw();
    }
  }

  private updateEnvironment(): void {
    store<u16>(w4.DRAW_COLORS, 4);
    w4.hline(0, 80, 160);
  }

  private updateUI(): void {
    const gamepad = load<u8>(w4.GAMEPAD1);
    const justPressed = gamepad & (gamepad ^ this.previousGamepad);

    scoreUI.draw();
    powerUI.draw();

    if (justPressed & w4.BUTTON_2) {
      Delayer.getInstance().purge();
      MetaGameState.setState(MetaGameStates.MAP);
    }
    levelEnd.draw();

    this.previousGamepad = gamepad;
  }
}
