import * as w4 from "../wasm4";

export class PaletteDefinition {
  protected colors: i32[] = [0, 1, 2, 3];

  public getColor(index: i32): i32 {
    return this.colors[index - 1];
  }
}

export class GameboyPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0xe0f8cf, 0x86c06c, 0x306850, 0x071821];
  }
}

export class IceCreamGBPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0xfff6d3, 0xf9a875, 0xeb6b6f, 0x7c3f58];
  }
}

export class SunriseGBPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x090d21, 0xa71442, 0xff5d18, 0xffddc9];
  }
}

export class Ayy4Palette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x00303b, 0xff7777, 0xffce96, 0xf1f2da];
  }
}

export class LavaGBPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x051f39, 0x4a2480, 0xc53a9d, 0xff8e80];
  }
}

export class TwoBitDemichromePalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x211e20, 0x555568, 0xa0a08b, 0xe9efec];
  }
}

export class HollowKnightPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x0f0f1b, 0x565a75, 0xc6b7be, 0xfafbf6];
  }
}

export class NostalgiaPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0xd0d058, 0xa0a840, 0x708028, 0x405010];
  }
}

export class GoldGBPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x210b1b, 0x4d222c, 0x9d654c, 0xcfab51];
  }
}

export class BitterSweetPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x282328, 0x545c7e, 0xc56981, 0xa3a29a];
  }
}

export class VelvetCherryGBPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x2d162c, 0x412752, 0x683a68, 0x9775a6];
  }
}

export class FieryPlagueGBPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x1a2129, 0x312137, 0x512839, 0x713141];
  }
}

export class RedBloodPainPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x7e1f23, 0xc4181f, 0x120a19, 0xfffcfe]; // altered
  }
}

export class RedIsDeadPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x11070a, 0xff0015, 0x860020, 0xfffcfe];
  }
}

export class BloodCrowPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x190000, 0x560909, 0xad2020, 0xf2e6e6];
  }
}

export class HorehoundFourPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x3c1402, 0xca9a57, 0xe96f1b, 0x312b24];
  }
}

export class NeonNightSkyPalette extends PaletteDefinition {
  constructor() {
    super();
    this.colors = [0x131626, 0x4d4d80, 0xe6a1cf, 0xffe6ea];
  }
}

export enum PaletteType {
  GAMEBOY,
  ICECREAM,
  SUNRISE,
  AYY4,
  LAVA,
  TWOBIT,
  HOLLOWKNIGHT,
  NOSTALGIA,
  GOLD,
  BITTERSWEET,
  VELVETCHERRY,
  FIERYPLAGUE,
  REDBLOODPAIN,
  REDISDEAD,
  BLOODCROW,
  HOREHOUND,
  NEONNIGHTSKY,
}

export class Palette {
  private static _instance: Palette;
  private static lastPalette: PaletteType;

  private constructor() {
    Palette.lastPalette = PaletteType.GAMEBOY;
  }

  public static getInstance(): Palette {
    if (!Palette._instance) Palette._instance = new Palette();

    return Palette._instance;
  }

  public useColor(paletteType: PaletteType): void {
    let paletteDefinition: PaletteDefinition;
    switch (paletteType) {
      case PaletteType.GAMEBOY:
        paletteDefinition = new GameboyPalette();
        break;
      case PaletteType.ICECREAM:
        paletteDefinition = new IceCreamGBPalette();
        break;
      case PaletteType.SUNRISE:
        paletteDefinition = new SunriseGBPalette();
        break;
      case PaletteType.AYY4:
        paletteDefinition = new Ayy4Palette();
        break;
      case PaletteType.LAVA:
        paletteDefinition = new LavaGBPalette();
        break;
      case PaletteType.TWOBIT:
        paletteDefinition = new TwoBitDemichromePalette();
        break;
      case PaletteType.HOLLOWKNIGHT:
        paletteDefinition = new HollowKnightPalette();
        break;
      case PaletteType.NOSTALGIA:
        paletteDefinition = new NostalgiaPalette();
        break;
      case PaletteType.GOLD:
        paletteDefinition = new GoldGBPalette();
        break;
      case PaletteType.BITTERSWEET:
        paletteDefinition = new BitterSweetPalette();
        break;
      case PaletteType.VELVETCHERRY:
        paletteDefinition = new VelvetCherryGBPalette();
        break;
      case PaletteType.FIERYPLAGUE:
        paletteDefinition = new FieryPlagueGBPalette();
        break;
      case PaletteType.REDBLOODPAIN:
        paletteDefinition = new RedBloodPainPalette();
        break;
      case PaletteType.REDISDEAD:
        paletteDefinition = new RedIsDeadPalette();
        break;
      case PaletteType.BLOODCROW:
        paletteDefinition = new BloodCrowPalette();
        break;
      case PaletteType.HOREHOUND:
        paletteDefinition = new HorehoundFourPalette();
        break;
      case PaletteType.NEONNIGHTSKY:
        paletteDefinition = new NeonNightSkyPalette();
        break;
      default:
        paletteDefinition = new GameboyPalette();
    }

    store<u32>(
      w4.PALETTE,
      paletteDefinition.getColor(0 + 1),
      0 * sizeof<u32>()
    );
    store<u32>(
      w4.PALETTE,
      paletteDefinition.getColor(1 + 1),
      1 * sizeof<u32>()
    );
    store<u32>(
      w4.PALETTE,
      paletteDefinition.getColor(2 + 1),
      2 * sizeof<u32>()
    );
    store<u32>(
      w4.PALETTE,
      paletteDefinition.getColor(3 + 1),
      3 * sizeof<u32>()
    );

    Palette.lastPalette = paletteType;
  }

  public getCurrentPalette(): PaletteType {
    return Palette.lastPalette;
  }
}
