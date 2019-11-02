import {ComponentType, Taxonomy} from "./ComponentType";
import {Bag} from "./../utils/Bag";
import {Aspect} from "./Aspect";
import {getClassName} from "./../prolog";
interface IdentityHashMap {
    [key:string]:ComponentType;
}

export class ComponentTypeFactory {
    /**
     * Contains all generated component types, newly generated component types
     * will be stored here.
     */
    private componentTypes_:IdentityHashMap;

    /** Amount of generated component types. */
    private componentTypeCount_:number = 0;

    /** Index of this component type in componentTypes. */
    public types:Bag<ComponentType>;

    constructor() {
        this.componentTypes_ = {};
        this.types = new Bag<ComponentType>();
        Aspect.typeFactory = this;
    }

    /**
     * Gets the component type for the given component class.
     * <p>
     * If no component type exists yet, a new one will be created and stored
     * for later retrieval.
     * </p>
     *
     * @param c
     *            the component's class to get the type for
     *
     * @return the component's {@link ComponentType}
     */
    public getTypeFor(c):ComponentType {
        // changed logic
        if ('number' === typeof c) {
            return this.types.get(c);
        }

        var type:ComponentType = this.componentTypes_[getClassName(c)];

        if (type == null) {
            var index:number = this.componentTypeCount_++;
            type = new ComponentType(c, index);
            this.componentTypes_[getClassName(c)] = type;
            this.types.set(index, type);
        }

        return type;
    }

    /**
     * Get the index of the component type of given component class.
     *
     * @param c
     *            the component class to get the type index for
     *
     * @return the component type's index
     */
    public getIndexFor(c):number {
        return this.getTypeFor(c).getIndex();
    }

    public getTaxonomy(index:number):Taxonomy {
        return this.types.get(index).getTaxonomy();
    }

}
