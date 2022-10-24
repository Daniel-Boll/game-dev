import { EntityManager, EntityType, Player } from "../entities";
import { Shop } from "../shop/shop";
import { MetaGameState, MetaGameStates } from "../state";
import * as w4 from "../wasm4";

const manager = EntityManager.getInstance();

let frameCount = 0;
export class PowerUI {
  private player: Player = new Player(EntityType.Player);
  private nextStep: f32 = 0;
  private currentStep: f32 = 0;
  private currentColor: u8 = 0x42;

  public draw(): void {
    const shop = <Shop>MetaGameState.getInfoOfState(MetaGameStates.SHOP);
    if (shop.getPlayerUsingOption() == -1) return;

    this.player = <Player>manager.getEntity(EntityType.Player);
    const powerMeter = this.player.getPowerMeter();
    const x = 2;
    const y = 2;
    const width = 156;
    const height = 4;
    this.nextStep = map(powerMeter, 0, 100, 0, <f32>width);

    if (this.currentStep < this.nextStep) {
      this.currentStep += 0.6;
    }

    // Two checks
    if (this.currentStep > this.nextStep) {
      this.currentStep = this.nextStep;
    }

    store<u16>(w4.DRAW_COLORS, 4);
    w4.rect(x, y, width, height);

    if (powerMeter == 100 && ++frameCount % 60 == 0)
      this.currentColor = this.currentColor == 0x42 ? 0x32 : 0x42;
    else if (powerMeter < 100) this.currentColor = 0x42;

    store<u16>(w4.DRAW_COLORS, this.currentColor);
    w4.rect(x, y, <i32>this.currentStep, height);
  }
}

// Map a value from one range to another
export function map(
  value: f32,
  start1: f32,
  stop1: f32,
  start2: f32,
  stop2: f32
): f32 {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}
