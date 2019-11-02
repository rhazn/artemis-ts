import {ComponentTypeFactory} from "./ComponentTypeFactory";
import {BitSet} from "./../utils/BitSet";
import {World} from "./World";
import {Class} from "./../prolog";
/**
 * An Aspects is used by systems as a matcher against entities, to check if a system is
 * interested in an entity. Aspects define what sort of component types an entity must
 * possess, or not possess.
 *
 * This creates an aspect where an entity must possess A and B and C:
 * Aspect.getAspectForAll(A.class, B.class, C.class)
 *
 * This creates an aspect where an entity must possess A and B and C, but must not possess U or V.
 * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class)
 *
 * This creates an aspect where an entity must possess A and B and C, but must not possess U or V, but must possess one of X or Y or Z.
 * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class).one(X.class, Y.class, Z.class)
 *
 * You can create and compose aspects in many ways:
 * Aspect.getEmpty().one(X.class, Y.class, Z.class).all(A.class, B.class, C.class).exclude(U.class, V.class)
 * is the same as:
 * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class).one(X.class, Y.class, Z.class)
 *
 * @author Arni Arent
 *
 */
export class Aspect {
    public static typeFactory: ComponentTypeFactory;
    private allSet_: BitSet;
    private exclusionSet_: BitSet;
    private oneSet_: BitSet;
    private world_: World;

    /**
     * @constructor
     */
    constructor() {
        this.allSet_ = new BitSet();
        this.exclusionSet_ = new BitSet();
        this.oneSet_ = new BitSet();
    }

    /**
     *
     * @param {artemis.World} world
     */
    public setWorld(world: World) {
        this.world_ = world;
    }

    public getAllSet(): BitSet {
        return this.allSet_;
    }

    public getExclusionSet(): BitSet {
        return this.exclusionSet_;
    }

    public getOneSet(): BitSet {
        return this.oneSet_;
    }

    private getIndexFor(c) {
        return Aspect.typeFactory.getIndexFor(c);
    }

    /**
     * Returns an aspect where an entity must possess all of the specified component types.
     * @param {Class} type a required component type
     * @param {Array<Class>} types a required component type
     * @return {artemis.Aspect} an aspect that can be matched against entities
     */
    all(type: Class, ...types: Class[]): Aspect {
        this.allSet_.set(this.getIndexFor(type));

        let t;
        for (t in types) {
            this.allSet_.set(this.getIndexFor(types[t]));
        }

        return this;
    }

    /**
     * Excludes all of the specified component types from the aspect. A system will not be
     * interested in an entity that possesses one of the specified exclusion component types.
     *
     * @param {Class} type component type to exclude
     * @param {Array<Class>} types component type to exclude
     * @return {artemis.Aspect} an aspect that can be matched against entities
     */
    exclude(type: Class, ...types: Class[]): Aspect {
        this.exclusionSet_.set(this.getIndexFor(type));

        let t;
        for (t in types) {
            this.exclusionSet_.set(this.getIndexFor(types[t]));
        }
        return this;
    }

    /**
     * Returns an aspect where an entity must possess one of the specified component types.
     * @param {Class} type one of the types the entity must possess
     * @param {Array<Class>} types one of the types the entity must possess
     * @return {artemis.Aspect} an aspect that can be matched against entities
     */
    one(type: Class, ...types: Class[]): Aspect {
        this.oneSet_.set(this.getIndexFor(type));

        for (const t in types) {
            this.oneSet_.set(this.getIndexFor(types[t]));
        }
        return this;
    }

    /**
     * Creates an aspect where an entity must possess all of the specified component types.
     *
     * @param {Class} type the type the entity must possess
     * @param {Array<Class>} types the type the entity must possess
     * @return {artemis.Aspect} an aspect that can be matched against entities
     *
     * @deprecated
     * @see getAspectForAll
     */
    static getAspectFor(type: Class, ...types: Class[]): Aspect {
        return Aspect.getAspectForAll(type, ...types);
    }

    /**
     * Creates an aspect where an entity must possess all of the specified component types.
     *
     * @param {Class} type a required component type
     * @param {Array<Class>} types a required component type
     * @return {artemis.Aspect} an aspect that can be matched against entities
     */
    static getAspectForAll(type: Class, ...types: Class[]): Aspect {
        const aspect: Aspect = new Aspect();
        aspect.all(type, ...types);
        return aspect;
    }

    /**
     * Creates an aspect where an entity must possess one of the specified component types.
     *
     * @param {Class} type one of the types the entity must possess
     * @param {Array<Class>} types one of the types the entity must possess
     * @return {artemis.Aspect} an aspect that can be matched against entities
     */
    static getAspectForOne(type: Class, ...types: Class[]): Aspect {
        const aspect: Aspect = new Aspect();
        aspect.one(type, ...types);
        return aspect;
    }

    /**
     * Creates and returns an empty aspect. This can be used if you want a system that processes no entities, but
     * still gets invoked. Typical usages is when you need to create special purpose systems for debug rendering,
     * like rendering FPS, how many entities are active in the world, etc.
     *
     * You can also use the all, one and exclude methods on this aspect, so if you wanted to create a system that
     * processes only entities possessing just one of the components A or B or C, then you can do:
     * Aspect.getEmpty().one(A,B,C);
     *
     * @return {artemis.Aspect} an empty Aspect that will reject all entities.
     */
    static getEmpty(): Aspect {
        return new Aspect();
    }
}
