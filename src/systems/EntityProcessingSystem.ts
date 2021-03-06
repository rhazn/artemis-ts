import {EntitySystem} from "./../core/EntitySystem";
import {Aspect} from "./../core/Aspect";
import {Entity} from "./../core/Entity";
import {ImmutableBag} from "./../utils/ImmutableBag";
/**
 * A typical entity system. Use this when you need to process entities possessing the
 * provided component types.
 *
 * @author Arni Arent
 *
 */
export abstract class EntityProcessingSystem extends EntitySystem {
    constructor(aspect: Aspect) {
        super(aspect);
    }

    /**
     * Process a entity this system is interested in.
     * @param e the entity to process.
     */
    protected abstract processEach(e: Entity): void;

    protected processEntities(entities: ImmutableBag<Entity>): void {
        for (let i = 0, s = entities.size(); s > i; i++) {
            this.processEach(entities[i]);
        }
    }

    protected checkProcessing(): boolean {
        return true;
    }
}
