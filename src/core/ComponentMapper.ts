import {Component} from "./Component";
import {ComponentType} from "./ComponentType";
import {Class} from "./../prolog";
import {Bag} from "./../utils/Bag";
import {World} from "./World";
import {Entity} from "./Entity";
/**
 * High performance component retrieval from entities. Use this wherever you
 * need to retrieve components from entities often and fast.
 *
 * @author Arni Arent
 *
 * @param <A> the class type of the component
 */
export class ComponentMapper<A extends Component> {
    private type_: ComponentType;
    private classType_: Class;
    private components_: Bag<Component>;

    constructor(type: Class, world: World) {
        //this.type_ = ComponentType.getTypeFor(type);
        this.type_ = world.getComponentManager().typeFactory.getTypeFor(type);
        this.components_ = world.getComponentManager().getComponentsByType(this.type_);
        this.classType_ = type;
    }

    /**
     * Fast but unsafe retrieval of a component for this entity.
     * No bounding checks, so this could throw an ArrayIndexOutOfBoundsExeption,
     * however in most scenarios you already know the entity possesses this component.
     *
     * @param e the entity that should possess the component
     * @return the instance of the component
     */
    public get(e: Entity): A {
        return <A>this.components_.get(e.getId());
    }

    /**
     * Fast and safe retrieval of a component for this entity.
     * If the entity does not have this component then null is returned.
     *
     * @param e the entity that should possess the component
     * @return the instance of the component
     */
    public getSafe(e: Entity): A {
        if (this.components_.isIndexWithinBounds(e.getId())) {
            return <A>this.components_.get(e.getId());
        }
        return null;
    }

    /**
     * Checks if the entity has this type of component.
     * @param e the entity to check
     * @return true if the entity has this component type, false if it doesn't.
     */
    public has(e: Entity): boolean {
        return this.getSafe(e) != null;
    }

    /**
     * Returns a component mapper for this type of components.
     *
     * @param type the type of components this mapper uses.
     * @param world the world that this component mapper should use.
     * @return a new mapper.
     */
    public static getFor<T extends Component>(type: Function, world: World): ComponentMapper<T> {
        return new ComponentMapper<T>(type, world);
    }

    // public static <T extends Component> ComponentMapper<T> getFor(Class<T> type, World world) {
    // 	return new ComponentMapper<T>(type, world);
    // }
}
