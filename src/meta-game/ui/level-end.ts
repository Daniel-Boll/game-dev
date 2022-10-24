import { Language } from "../../controllers";
import { centeredText } from "../../utils/ui";
import { Delayer } from "../../utils/utils";
import { Shop } from "../shop/shop";
import { MetaGameState, MetaGameStates } from "../state";
import * as w4 from "../wasm4";
import { Map as MetaGameMap } from "./map";
import { playCoinSound, playLevelEndConfirmation } from "./sound";

class Reward {
  level: u8;
  percentageCap: u8[];
  amountCorrespondece: u8[];
}

let frameCount: u8 = 0;
export class LevelEndUI {
  private level: u8 = 0;
  private score: u8 = 0;
  private maxScore: u8 = 0;
  private isOpen: boolean = false;
  private width: u8 = 100;
  private height: u8 = 60;
  private x: u8 = 30;
  private y: u8 = 50;
  private won: boolean = false;

  private previousGamepad: u8 = 0;

  private rewards: Reward[] = [
    {
      level: 0,
      percentageCap: [100, 75, 0],
      amountCorrespondece: [5, 3, 1],
    },
    {
      level: 1,
      percentageCap: [100, 75, 0],
      amountCorrespondece: [5, 3, 1],
    },
    {
      level: 2,
      percentageCap: [100, 75, 0],
      amountCorrespondece: [8, 5, 3],
    },
    {
      level: 3,
      percentageCap: [100, 75, 0],
      amountCorrespondece: [8, 5, 3],
    },
    {
      level: 4,
      percentageCap: [100, 75, 0],
      amountCorrespondece: [8, 5, 3],
    },
    {
      level: 5,
      percentageCap: [100, 75, 0],
      amountCorrespondece: [10, 8, 5],
    },
  ];

  // Animation
  private currentAmountOfCoins: f32 = 0;
  private lastInteger: i32 = 0;

  public open(level: u8, score: i8, maxScore: u8): LevelEndUI {
    this.level = level;
    this.score = score;
    this.maxScore = maxScore;
    this.isOpen = true;

    return this;
  }

  // |======================|
  // |       Level 1        |
  // |     O     O     O    |
  // |       You won!       |
  // |    Coins earned: 5   |
  // |                      |
  // |       < OK >         |
  // |======================|

  public draw(): void {
    // Create a rectangle in the bottom for the dialog
    if (this.isOpen) {
      const shop = <Shop>MetaGameState.getInfoOfState(MetaGameStates.SHOP);
      const playerCoins = shop.getCoins();

      this.logic();

      store<u16>(w4.DRAW_COLORS, 0x43);
      w4.rect(this.x, this.y, this.width, this.height);

      const constraint: i32[] = [this.x, this.x + this.width];
      store<u16>(w4.DRAW_COLORS, 0x1);
      centeredText(
        `${Language.getContent("level_end_level")} ${this.level + 1}`,
        55,
        constraint
      );

      const percentage = <f32>((<f32>this.score / <f32>this.maxScore) * 100);
      const won = percentage <= 100 && percentage > 0;
      store<u16>(w4.DRAW_COLORS, 0x1);
      centeredText(
        Language.getContent(`level_end_${won ? "won" : "lost"}`),
        70,
        constraint
      );

      store<u16>(w4.DRAW_COLORS, 0x1);
      centeredText(
        `© ${playerCoins + <i32>this.currentAmountOfCoins}`,
        85,
        constraint
      );

      store<u16>(w4.DRAW_COLORS, 0x14);
      centeredText(
        `<${Language.getContent(`level_end_${won ? "ok" : "redo"}`)}>`,
        100,
        constraint
      );
    }
  }

  private logic(): void {
    const percentage = <f32>((<f32>this.score / <f32>this.maxScore) * 100);
    const won = percentage <= 100 && percentage > 50;
    const reward = this.rewards[this.level];
    let coinsEarned = 0;

    if (won)
      for (let i = 0; i < reward.percentageCap.length; i++)
        if (percentage >= reward.percentageCap[i]) {
          coinsEarned = reward.amountCorrespondece[i];
          break;
        }

    // Store the last integer of the currentAmountOfCoins
    if (this.lastInteger < <i32>this.currentAmountOfCoins) {
      this.lastInteger = <i32>this.currentAmountOfCoins;
      playCoinSound();
    }

    if (<i32>this.currentAmountOfCoins < coinsEarned) {
      this.currentAmountOfCoins += 0.1;
    } else {
      this.currentAmountOfCoins = <f32>coinsEarned;
    }

    const gamepad = load<u8>(w4.GAMEPAD1);
    const justPressed = gamepad & (gamepad ^ this.previousGamepad);

    if (justPressed & w4.BUTTON_1) {
      if (won) {
        const shop = <Shop>MetaGameState.getInfoOfState(MetaGameStates.SHOP);
        shop.addCoins(<u8>coinsEarned);

        const map = <MetaGameMap>(
          MetaGameState.getInfoOfState(MetaGameStates.MAP)
        );
        map.newLevel();
      }

      this.isOpen = false;
      playLevelEndConfirmation();

      Delayer.getInstance().purge();
      MetaGameState.setState(won ? MetaGameStates.MAP : MetaGameStates.BATTLE);
    }
  }
}
