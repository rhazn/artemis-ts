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

    public abstract initialize();

    public setWorld(world: World) {
        this.world_ = world;
    }

    public getWorld(): World {
        return this.world_;
    }

    public abstract added(e: Entity);

    public abstract changed(e: Entity);

    public abstract deleted(e: Entity);

    public abstract disabled(e: Entity);

    public abstract enabled(e: Entity);
}
