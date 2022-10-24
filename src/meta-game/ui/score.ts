import { Player, EntityManager, EntityType, Enemy } from "../entities";

import * as w4 from "../wasm4";

const manager = EntityManager.getInstance();

export class ScoreUI {
  private levelMaxScore: i32;

  public setLevelMaxScore(levelMaxScore: i32): void {
    this.levelMaxScore = levelMaxScore;
  }

  public draw(): void {
    store<u16>(w4.DRAW_COLORS, 3);
    this.drawPlayerScore();
    this.drawEnemyScore();
  }

  private drawPlayerScore(): void {
    const player = <Player>manager.getEntity(EntityType.Player);

    w4.text(`${player.getScore()}/${this.levelMaxScore}`, 20, 160 - 30);
  }

  private drawEnemyScore(): void {
    const enemy = <Enemy>manager.getEntity(EntityType.Enemy);
    w4.text(`${enemy.getScore()}/${this.levelMaxScore}`, 20, 30);
  }
}
