import * as w4 from "../wasm4";
import { Entity, EntityManager, EntityType } from "./manager";
import { Player } from "./player";
import { Enemy } from "./enemy";

import { Position } from "../../utils/structures";
import { playBallHit } from "../ui/sound";
import { randomInRangeFloat } from "../../utils/utils";
import {
  circleIntersectsWithRectangle,
  reflectVector,
} from "../../utils/geometry";
import { MetaGameState, MetaGameStates } from "../state";
import { Map as MapGameLoop } from "../ui/map";

const manager = EntityManager.getInstance();

export class Ball extends Entity {
  private position: Position<f32> = new Position<f32>();
  private test: Position<f32> = new Position<f32>();
  private direction: Position<f32> = new Position<f32>();
  private speed: f32 = 0;
  private speedPerLevel: f32[] = [1, 1.5, 2, 2.3, 2.3];
  private size: u8 = 4;
  private rebound: u8 = 1;
  private enableCollision: bool = true;
  private static capSpeed: i8 = -1;

  public spawn(x: i16, y: i16): void {
    this.position.x = x;
    this.position.y = y;

    let angle = <f32>randomInRangeFloat(30, 150);
    angle = angle * <f32>(Math.PI / 180);

    this.direction.x = <f32>Math.cos(angle);
    this.direction.y = <f32>Math.sin(angle);

    const level = (<MapGameLoop>(
      MetaGameState.getInfoOfState(MetaGameStates.MAP)
    )).getCurrentLevel();

    this.speed = this.speedPerLevel[level];
  }

  public getDirection(): Position<f32> {
    return this.direction;
  }

  public setDirection(direction: Position<f32>): Ball {
    this.direction = direction;
    return this;
  }

  public setSpeed(speed: f32): Ball {
    this.speed = speed;
    return this;
  }

  public getSpeed(): f32 {
    return this.speed;
  }

  public static setSpeedCap(cap: i8): void {
    Ball.capSpeed = cap;
  }

  public getBounces(): u8 {
    return this.rebound;
  }

  public setBounce(bounce: u8): Ball {
    this.rebound = bounce;
    return this;
  }

  public increaseRebound(): Ball {
    this.rebound++;
    return this;
  }

  public update(): Ball {
    if (Ball.capSpeed != -1) this.speed = Ball.capSpeed;

    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;

    // Add a average delta time for 60 fps
    // this.position.x += this.direction.x * this.speed * 0.016666666666666666;
    // this.position.y += this.direction.y * this.speed * 0.016666666666666666;

    // this.position.x += <f32>Math.round(this.direction.x * this.speed);
    // this.position.y += <f32>Math.round(this.direction.y * this.speed);

    // Reflect on left and right walls
    if (this.position.x < 0) {
      this.position.x = 0;
      this.direction = reflectVector(this.direction, { x: 1, y: 0 });
    } else if (this.position.x > 160 - this.size) {
      this.position.x = 160 - this.size;

      this.direction = reflectVector(this.direction, { x: -1, y: 0 });
    }

    const enemy = <Enemy>manager.getEntity(EntityType.Enemy);
    const player = <Player>manager.getEntity(EntityType.Player);
    if (this.position.y < 0) {
      manager.deleteEntitiesByTag(this.tag);
      player.increaseScore();
      enemy.releaseMoreBalls();
    } else if (this.position.y > 180 - this.size) {
      manager.deleteEntitiesByTag(this.tag);
      enemy.increaseScore().releaseMoreBalls();
    }

    if (this.position.y < 70 && this.enableCollision === false) {
      this.enableCollision = true;
    }

    if (this.enableCollision === true) {
      this.checkAgainstPlayer();
    }

    // Check for the collision with the enemy
    if (
      this.position.y <= 30 + this.size &&
      this.rebound > 1 &&
      this.rebound < 6
    ) {
      this.direction = reflectVector(this.direction, { x: 0, y: -1 });
      this.rebound++;
      enemy.teleportTo(<i32>this.position.x);
      // enemy.teleportTo(this.position.x);
      if (!player.isInSlowMotion()) playBallHit();
    }

    return this;
  }

  public draw(): Ball {
    store<u16>(w4.DRAW_COLORS, this.rebound / 2 + 1);

    w4.oval(
      <i32>(this.position.x + 0.5),
      <i32>(this.position.y + 0.5),
      this.size,
      this.size
    );

    return this;
  }

  private checkAgainstPlayer(): void {
    const player = <Player>manager.getEntity(EntityType.Player);
    const collision = circleIntersectsWithRectangle(
      { x: <i32>this.position.x, y: <i32>this.position.y },
      // this.position,
      player.getPosition(),
      this.size,
      player.getWidth(),
      player.getHeight()
    );

    if (collision) {
      this.direction = reflectVector(this.direction, { x: 0, y: 1 });
      this.rebound++;
      this.speed += 0.2;
      this.enableCollision = false;

      if (!player.isInSlowMotion()) playBallHit();
      player.increasePowerMeter();
    }
  }
}
