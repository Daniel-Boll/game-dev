import * as w4 from "../wasm4";
import { Entity, EntityManager, EntityType } from "./manager";
import { Ball } from "./ball";
import { playBallHit, playSlowMotion } from "../ui/sound";
import { Position } from "../../utils/structures";
import { Delayer } from "../../utils/utils";
import { MetaGameState, MetaGameStates } from "../state";
import { Shop } from "../shop/shop";

const manager = EntityManager.getInstance();

let frameCount = 0;

export class Player extends Entity {
  // Info
  private name: string = "Player";
  private position: Position<i32> = new Position<i32>();
  private speed: u8 = 2;
  private speedPerLevel: Array<u8> = [2, 2, 2, 3, 3];
  private width: u8 = 24;
  private height: u8 = 6;
  private score: u8 = 0;

  // Movement
  private previousGamepad: u8 = 0;

  // Power
  private inSpecial: bool = false;
  private powerMeter: u8 = 0;
  private powerImplementation: Array<(this: Player) => void> = [
    this.increaseOneRebounce,
    this.slowMotion,
    this.freeze,
    this.increaseTwoRebounce,
    this.shinraTensei,
  ];
  private inSlowMotion: bool = false;

  // Power aux (no closures is a pain in the ass)
  private ballsDirection: Array<Position<f32>> = [];
  private ballsSpeed: Array<f32> = [];
  private rebouncesCount: i32 = 0;

  public setPosition(x: i16, y: i16): Player {
    this.position.x = x;
    this.position.y = y;

    return this;
  }

  public getName(): string {
    return this.name;
  }

  public getPosition(): Position<i32> {
    return this.position;
  }

  public getWidth(): u8 {
    return this.width;
  }

  public getHeight(): u8 {
    return this.height;
  }

  public getScore(): u8 {
    return this.score;
  }

  public setScore(score: u8): Player {
    this.score = score;
    return this;
  }

  public setSpeedByLevel(level: u8): Player {
    this.speed = this.speedPerLevel[level];
    return this;
  }

  public increaseScore(): Player {
    this.score++;
    return this;
  }

  public isInSlowMotion(): bool {
    return this.inSlowMotion;
  }

  public isPlayerInSpecial(): bool {
    return this.inSpecial;
  }

  public getPowerMeter(): u8 {
    return this.powerMeter;
  }

  public increasePowerMeter(): Player {
    if (!this.inSlowMotion) this.powerMeter += 10;
    if (this.powerMeter > 100) this.powerMeter = 100;
    return this;
  }

  public getBallsDirection(): Array<Position<f32>> {
    return this.ballsDirection;
  }

  public update(): Player {
    const gamepad = load<u8>(w4.GAMEPAD1);
    const justPressed = gamepad & (gamepad ^ this.previousGamepad);

    if (this.inSpecial) playBallHit();

    let direction: Position<i32> = new Position<i32>();

    if (gamepad & w4.BUTTON_RIGHT) {
      if (gamepad & w4.BUTTON_UP) {
        direction = { x: 1, y: -1 };
      } else if (gamepad & w4.BUTTON_DOWN) {
        direction = { x: 1, y: 1 };
      } else {
        direction = { x: 1, y: 0 };
      }
    } else if (gamepad & w4.BUTTON_LEFT) {
      if (gamepad & w4.BUTTON_UP) {
        direction = { x: -1, y: -1 };
      } else if (gamepad & w4.BUTTON_DOWN) {
        direction = { x: -1, y: 1 };
      } else {
        direction = { x: -1, y: 0 };
      }
    } else if (gamepad & w4.BUTTON_UP) {
      direction = { x: 0, y: -1 };
    } else if (gamepad & w4.BUTTON_DOWN) {
      direction = { x: 0, y: 1 };
    } else {
      direction = { x: 0, y: 0 };
    }

    if (gamepad && !this.inSpecial) {
      this.position.x += direction.x * this.speed;
      this.position.y += direction.y * this.speed;

      if (this.position.x < 0) {
        this.position.x = 0;
      } else if (this.position.x > 160 - this.width) {
        this.position.x = 160 - this.width;
      }

      if (this.position.y < 80) {
        this.position.y = 80;
      } else if (this.position.y > 160 - this.height) {
        this.position.y = 160 - this.height;
      }
    }

    if (justPressed & w4.BUTTON_1 && this.powerMeter == 100) {
      // Query which power is being used
      const shop = <Shop>MetaGameState.getInfoOfState(MetaGameStates.SHOP);
      const index = shop.getPlayerUsingOption();

      if (index != -1) {
        this.powerImplementation[index].call(this);
        this.powerMeter = 0;
      }
    }

    this.previousGamepad = gamepad;
    frameCount++;
    return this;
  }

  public draw(): Player {
    store<u16>(w4.DRAW_COLORS, 0x32);
    if (this.inSpecial) {
      if (frameCount % 10 == 0) {
        store<u16>(w4.DRAW_COLORS, 0x34);
      }
    }
    w4.rect(this.position.x, this.position.y, this.width, this.height);
    return this;
  }

  // Powers

  public increaseOneRebounce(): void {
    this.increaseRebounces(1);
  }

  public slowMotion(): void {
    Ball.setSpeedCap(1);
    playSlowMotion();
    this.inSlowMotion = true;

    Delayer.getInstance().delay<Player>(1000, this, (player: Entity) => {
      Ball.setSpeedCap(-1);
      (<Player>player).inSlowMotion = false;
    });
  }

  public freeze(): void {
    const balls = manager.getEntities(EntityType.Ball);

    this.ballsDirection = balls.map<Position<f32>>((entity) => {
      const ball = <Ball>entity;
      const direction = ball.getDirection();
      if (ball.getBounces() <= 2) ball.setDirection({ x: 0, y: 0 });

      return direction;
    });
    this.inSpecial = true;

    Delayer.getInstance().delay<Player>(5, this, (context: Entity) => {
      const player = <Player>context;
      player.inSpecial = false;
    });

    Delayer.getInstance().delay<Player>(120, this, (context: Entity) => {
      const player = <Player>context;
      const balls = manager.getEntities(EntityType.Ball);

      if (!balls.length) return;
      if (!player.ballsDirection.length) return;

      for (let i = 0; i < balls.length; i++) {
        const ball = <Ball>balls[i];
        if (ball.getBounces() <= 2) ball.setDirection(player.ballsDirection[i]);
      }
    });
  }

  public increaseTwoRebounce(): void {
    this.increaseRebounces(2);
  }

  public increaseRebounces(count: i32): void {
    const balls = manager.getEntities(EntityType.Ball);
    this.rebouncesCount = count;

    this.ballsDirection = balls.map<Position<f32>>((entity) => {
      const ball = <Ball>entity;
      const direction = ball.getDirection();
      ball.setDirection({ x: 0, y: 0 });

      return direction;
    });
    this.inSpecial = true;

    Delayer.getInstance().delay<Player>(60, this, (context: Entity) => {
      const player = <Player>context;
      const balls = manager.getEntities(EntityType.Ball);

      if (!balls.length) return;
      if (!player.ballsDirection.length) return;

      for (let i = 0; i < balls.length; i++) {
        const ball = <Ball>balls[i];
        if (player.rebouncesCount >= 1)
          ball.increaseRebound().increaseRebound();
        if (player.rebouncesCount >= 2)
          ball.increaseRebound().increaseRebound();

        if (ball.getBounces() < 6) {
          ball.setDirection(player.ballsDirection[i]);
        } else {
          ball.setDirection({ x: 0, y: -1 }).setSpeed(6);
        }
      }

      player.inSpecial = false;
    });
  }

  public shinraTensei(): void {
    const balls = manager.getEntities(EntityType.Ball);
    balls.forEach((ball) => (<Ball>ball).setDirection({ x: 0, y: 0 }));
    this.inSpecial = true;

    Delayer.getInstance().delay<Player>(60, this, (context: Entity) => {
      const player = <Player>context;
      manager
        .getEntities(EntityType.Ball)
        .forEach((ball) =>
          (<Ball>ball).setDirection({ x: 0, y: -1 }).setSpeed(8).setBounce(10)
        );

      player.inSpecial = false;
    });
  }
}
