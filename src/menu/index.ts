import * as w4 from "../wasm4";

import { GameLoop, GameState, GameStates, Language } from "../controllers";
import {
  playMenuOptionSelection,
  playMenuOptionTransitionSound,
  playMenuOptionUnavailable,
} from "../meta-game/ui";
import { isMouseOver } from "../utils/ui";

export class Menu extends GameLoop {
  private options: Array<string> = [
    "ui_begin_new_game",
    "ui_continue_game",
    "ui_credit",
  ];
  private isMouseOverLanguage: boolean = false;
  private currentOption: u8 = 0;

  private previousStateMouse: u8 = 0;
  private previousStateGamepad: u8 = 0;

  public setup(): void {}

  public ui(): void {
    store<u16>(w4.DRAW_COLORS, this.isMouseOverLanguage ? 3 : 2);
    w4.text(Language.getLanguage(), 140, 5);

    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];
      const text = Language.getContent(option);
      const y = 60 + i * 20;

      store<u16>(w4.DRAW_COLORS, this.currentOption == i ? 0x3 : 0x2);
      this.centeredText(`${this.currentOption == i ? "\x85" : ""} ${text}`, y);
    }
  }

  public loop(): void {
    this.ui();
    this.changeOptions();
    this.checkMouseOverLanguage();
  }

  public changeOptions(): void {
    const gamepad = load<u8>(w4.GAMEPAD1);
    const justPressed = gamepad & (gamepad ^ this.previousStateGamepad);

    if (justPressed & w4.BUTTON_UP) {
      this.currentOption = this.currentOption == 0 ? 2 : this.currentOption - 1;
      playMenuOptionTransitionSound();
    } else if (justPressed & w4.BUTTON_DOWN) {
      this.currentOption = this.currentOption == 2 ? 0 : this.currentOption + 1;
      playMenuOptionTransitionSound();
    }

    if (justPressed & w4.BUTTON_1) {
      if (this.currentOption == 0) {
        // Begin new game
        GameState.setState(GameStates.META_GAME);
        playMenuOptionSelection();
      } else if (this.currentOption == 1) {
        // Continue game
        playMenuOptionUnavailable();
      } else if (this.currentOption == 2) {
        // Credit
        playMenuOptionUnavailable();
      }
    }

    this.previousStateGamepad = gamepad;
  }

  public centeredText(text: string, y: i32): void {
    const x = (160 - text.length * 8) / 2;
    w4.text(text, x, y);
  }

  public checkMouseOverLanguage(): void {
    const mouse = load<u8>(w4.MOUSE_BUTTONS);
    const justClicked = mouse & (mouse ^ this.previousStateMouse);

    this.isMouseOverLanguage = isMouseOver(140, 160, 5, 10);

    if (justClicked & w4.MOUSE_LEFT && this.isMouseOverLanguage) {
      Language.nextLanguage();
      playMenuOptionTransitionSound();
    }

    this.previousStateMouse = mouse;
  }
}
