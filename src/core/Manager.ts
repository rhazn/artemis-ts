import {EntityObserver} from "./EntityObserver";
import {World} from "./World";
import {Entity} from "./Entity";
/**
 * Manager.
 *
 * @author Arni Arent
 *
 */
export abstract class Manager implements EntityObserver {
    protected world_: World;

    public setWorld(world: World): void {
        this.world_ = world;
    }

    public getWorld(): World {
        return this.world_;
    }

    public abstract initialize(): void;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public added(e: Entity): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public changed(e: Entity): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public deleted(e: Entity): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public disabled(e: Entity): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public enabled(e: Entity): void {}
}
