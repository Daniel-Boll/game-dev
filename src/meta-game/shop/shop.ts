import * as w4 from "../wasm4";
import { MetaGameLoop, MetaGameState, MetaGameStates } from "../state";
import { Palette, PaletteType } from "../ui";
import { GameState, GameStates, Language } from "../../controllers";
import { Menu } from "../../menu";

let paletteState: PaletteType;
let lastMouseState: u8 = 0;

class Clickable {
  x: i32;
  y: i32;
  width: i32;
  height: i32;

  public isMouseOver(): boolean {
    const mouseX = load<i16>(w4.MOUSE_X);
    const mouseY = load<i16>(w4.MOUSE_Y);
    const error = 0;

    return (
      mouseX > this.x - error &&
      mouseX < this.x + this.width + error &&
      mouseY > this.y - error &&
      mouseY < this.y + this.height + error
    );
  }
}

class XButton extends Clickable {
  public init(x: i32, y: i32, width: i32, height: i32): XButton {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    return this;
  }

  public draw(): XButton {
    store<u16>(w4.DRAW_COLORS, this.isMouseOver() ? 0x24 : 0x23);
    w4.text("X", this.x, this.y);
    return this;
  }

  public loop(): XButton {
    if (this.isMouseOver()) {
      const mouse = load<u8>(w4.MOUSE_BUTTONS);
      const justClicked = mouse & (mouse ^ lastMouseState);

      if (justClicked & w4.MOUSE_LEFT) {
        Palette.getInstance().useColor(paletteState);
        MetaGameState.setState(MetaGameStates.MAP);
      }

      lastMouseState = mouse;
    }

    return this;
  }
}

class Option extends Clickable {
  private idx: i32;
  private coinsNeeded: i32;
  private availableCoins: i32;
  private text: string = "";
  private bought: boolean = false;
  private ShopInstance: MetaGameLoop = new MetaGameLoop();

  public init(
    idx: i32,
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    coinsNeeded: i32,
    availableCoins: i32,
    shop: MetaGameLoop
  ): Option {
    this.idx = idx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.coinsNeeded = coinsNeeded;
    this.availableCoins = availableCoins;
    this.ShopInstance = shop;

    return this;
  }

  public draw(): Option {
    store<u16>(w4.DRAW_COLORS, this.color());
    w4.text(this.getText(), this.x, this.y);
    return this;
  }

  private getText(): string {
    const shop = <Shop>this.ShopInstance;
    const isUsing = shop.getPlayerUsingOption() == this.idx;

    if (isUsing) return Language.getContent(`shop_option_${this.idx}_using`);
    if (this.bought) return Language.getContent(`shop_option_${this.idx}_sold`);

    return Language.getContent(`shop_option_${this.idx}_selling`).replace(
      "~",
      this.coinsNeeded.toString()
    );
  }

  public color(): u8 {
    const shop = <Shop>this.ShopInstance;

    if (this.isMouseOver()) return 0x4;

    if (this.bought || <i32>shop.getCoins() < this.coinsNeeded) return 0x2;

    return 0x3;
  }

  public loop(): Option {
    if (this.isMouseOver()) {
      const mouse = load<u8>(w4.MOUSE_BUTTONS);
      const justClicked = mouse & (mouse ^ lastMouseState);

      if (justClicked & w4.MOUSE_LEFT) {
        const shop = <Shop>this.ShopInstance;
        if (!this.bought && <i32>shop.getCoins() >= this.coinsNeeded) {
          shop.reduceCoins(<u8>this.coinsNeeded);
          this.bought = true;
        }

        if (this.bought) shop.setPlayerUsingOption(<i8>this.idx);
      }

      lastMouseState = mouse;
    }

    return this;
  }
}

export class Shop extends MetaGameLoop {
  // Player props
  private coins: u8 = 0;
  private using: i8 = -1;

  // UI
  private xButton: XButton = new XButton();
  private options: Option[] = [
    new Option(),
    new Option(),
    new Option(),
    new Option(),
    new Option(),
  ];

  public setup(): void {
    (<Menu>GameState.getInfoOfState(GameStates.MENU)).getDifficulty() == "easy"
      ? (this.coins = 80)
      : (this.coins = 0);

    // Get info about the difficulty in the map
    paletteState = Palette.getInstance().getCurrentPalette();
    Palette.getInstance().useColor(PaletteType.GOLD);

    this.xButton.init(150, 10, 8, 8);

    const coinsNeeded = [5, 10, 10, 15, 30];

    for (let i = 0; i < this.options.length; i++) {
      this.options[i].init(
        i, // x
        10, // y
        50 + i * 15 + (i > 2 ? 10 : 0), // Padding
        140, // Width
        15, //  Height
        coinsNeeded[i], // Coins needed
        this.coins, // Available coins
        this
      );
    }
  }

  public getCoins(): u8 {
    return this.coins;
  }

  public addCoins(amount: u8): void {
    this.coins += amount;
  }

  public reduceCoins(amount: u8): void {
    this.coins -= amount;
  }

  public getPlayerUsingOption(): i8 {
    return this.using;
  }

  public setPlayerUsingOption(idx: i8): void {
    this.using = idx;
  }

  public getOptions(): Option[] {
    return this.options;
  }

  public updateOption(option: Option, idx: i32): void {
    this.options[idx] = option;
  }

  public loop(): void {
    store<u16>(w4.DRAW_COLORS, 0x23);
    w4.text("Shop", 10, 10);

    store<u16>(w4.DRAW_COLORS, 0x4);
    w4.text(`coins © (${this.coins})`, 10, 30);

    this.xButton.draw().loop();

    for (let i = 0; i < this.options.length; i++) {
      this.options[i].draw().loop();
    }
  }
}
