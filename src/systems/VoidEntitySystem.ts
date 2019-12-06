import {EntitySystem} from "./../core/EntitySystem";
import {Aspect} from "./../core/Aspect";
/**
 * This system has an empty aspect so it processes no entities, but it still gets invoked.
 * You can use this system if you need to execute some game logic and not have to concern
 * yourself about aspects or entities.
 *
 * @author Arni Arent
 *
 */
export abstract class VoidEntitySystem extends EntitySystem {
    constructor() {
        super(Aspect.getEmpty());
    }

    protected processEntities() {
        this.processSystem();
    }

    protected abstract processSystem();

    protected checkProcessing(): boolean {
        return true;
    }
}
