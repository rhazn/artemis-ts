import {Entity} from "./Entity";
import {World} from "./World";
export interface EntityTemplateInterface {
    buildEntity(entity: Entity, world: World, ...args: any[]);
}
