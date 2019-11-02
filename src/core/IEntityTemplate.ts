import {Entity} from "./Entity";
import {World} from "./World";
export interface IEntityTemplate {
    buildEntity(entity:Entity, world:World, ...args:any[]);
}