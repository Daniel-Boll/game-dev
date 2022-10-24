import { Entity, EntityType } from "../meta-game/entities";

export function randomInRange(min: i32, max: i32): f64 {
  return Math.random() * (max - min) + min;
}

export function randomInRangeFloat(min: f32, max: f32): f64 {
  return Math.random() * (max - min) + min;
}

export function isNumber<T>(): bool {
  return isFloat<T>() || isInteger<T>();
}

// Delayer.getInstance().delay(1000, () => {console.log("oi")});
// Delayer.getInstance().update();

export class DelayObject<T = i32> {
  public time: i32 = 0;
  public classInstance: T;
  public getBack: (classInstance: T) => void;

  constructor(
    time: i32,
    classInstance: T,
    getBack: (classInstance: T) => void
  ) {
    this.time = time;
    this.classInstance = classInstance;
    this.getBack = getBack;
  }
}

// Manage various delays
export class Delayer {
  private static instance: Delayer;
  private delays: Array<DelayObject<Entity>> = new Array<DelayObject<Entity>>();

  public static getInstance(): Delayer {
    if (!Delayer.instance) {
      Delayer.instance = new Delayer();
    }

    return Delayer.instance;
  }

  public delay<T>(
    time: i32,
    classInstance: T,
    getBack: (classInstance: Entity) => void
  ): void {
    this.delays.push(
      new DelayObject<Entity>(time, <Entity>classInstance, getBack)
    );
  }

  public delayCallback(time: i32, callback: (_: Entity) => void): void {
    this.delays.push(
      new DelayObject<Entity>(time, new Entity(EntityType.Ball), callback)
    );
  }

  public update(): void {
    // @ts-ignore
    this.delays.forEach((value, index, array) => {
      value.time--;
      if (value.time <= 0) {
        value.getBack(value.classInstance);
        array.splice(index, 1);
      } else array[index].time--;
    });
  }

  public purge(): void {
    this.delays = new Array<DelayObject<Entity>>();
  }

  // if (delay.time <= 0) {
  //   delay.callback();
  //   delays.splice(index, 1);
  // } else delays[index].time--;
}
