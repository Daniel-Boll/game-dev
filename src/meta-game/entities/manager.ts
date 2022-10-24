import * as w4 from "../wasm4";
import { Player } from "./player";
import { Enemy } from "./enemy";
import { Ball } from "./ball";

export enum EntityType {
  Player,
  Enemy,
  Ball,
}

export class Entity {
  public tag: string = "";
  public type: EntityType;

  constructor(type: EntityType) {
    this.type = type;
  }

  public addTag(tag: string): Entity {
    this.tag = tag;
    return this;
  }
}

export class EntityManager {
  // ===========  Singleton  ===========
  private static instance: EntityManager;
  private constructor() {}

  public static getInstance(): EntityManager {
    if (!EntityManager.instance) EntityManager.instance = new EntityManager();

    return EntityManager.instance;
  }
  // ====================================

  private entities: Array<Entity> = [] as Array<Entity>;
  public tag: string = "";
  public type: EntityType;

  public addEntity(type: EntityType): EntityManager {
    this.type = type;
    return this;
  }

  public addTag(tag: string): EntityManager {
    this.tag = tag;
    return this;
  }

  public create(): Entity {
    switch (this.type) {
      case EntityType.Player: {
        let newEntity = new Player(this.type);
        newEntity.addTag(this.tag);
        this.entities.push(newEntity);
        return newEntity;
      }
      case EntityType.Enemy: {
        let newEntity = new Enemy(this.type);
        newEntity.addTag(this.tag);
        this.entities.push(newEntity);
        return newEntity;
      }
      case EntityType.Ball: {
        let newEntity = new Ball(this.type);
        newEntity.addTag(this.tag);
        this.entities.push(newEntity);
        return newEntity;
      }
      default: {
        throw new Error("Entity not implemented yet.");
      }
    }
  }

  public resetStates(): void {
    this.entities = [] as Array<Entity>;
  }

  public getEntityByTag(tag: string): Entity {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].tag === tag) {
        return this.entities[i];
      }
    }

    throw new Error("Entity not found");
  }

  public getEntitiesByTag(tag: string): Array<Entity> {
    let entities: Array<Entity> = [] as Array<Entity>;

    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].tag === tag) {
        entities.push(this.entities[i]);
      }
    }

    return entities;
  }

  public getEntity(type: EntityType): Entity {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].type === type) {
        return this.entities[i];
      }
    }

    throw new Error("Entity not found");
  }

  public getEntities(type: EntityType): Array<Entity> {
    let entities: Array<Entity> = [] as Array<Entity>;

    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].type === type) {
        entities.push(this.entities[i]);
      }
    }

    return entities;
  }

  public deleteEntitiesByTag(tag: string): void {
    for (let i = 0; i < this.entities.length; i++)
      if (this.entities[i].tag === tag) this.entities.splice(i, 1);
  }
}
