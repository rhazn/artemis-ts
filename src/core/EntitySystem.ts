import {EntityObserver} from "./EntityObserver";
import {World} from "./World";
import {Bag} from "./../utils/Bag";
import {Entity} from "./Entity";
import {Aspect} from "./Aspect";
import {BitSet} from "./../utils/BitSet";
import {ImmutableBag} from "./../utils/ImmutableBag";
import {HashMap} from "./../utils/HashMap";
import {Class} from "./../prolog";
import {BlackBoard} from "./../blackboard/BlackBoard";

/**
 * Used to generate a unique bit for each system.
 * Only used internally in EntitySystem.
 */
export class SystemIndexManager {
    public static INDEX = 0;
    private static indices: HashMap<Function, number> = new HashMap<Function, number>();

    public static getIndexFor(es: Class): number {
        let index: number = SystemIndexManager.indices.get(es);
        if (index === undefined) {
            index = SystemIndexManager.INDEX++;
            SystemIndexManager.indices.put(es, index);
        }
        return index;
    }
}

/**
 * The most raw entity system. It should not typically be used, but you can create your own
 * entity system handling by extending this. It is recommended that you use the other provided
 * entity system implementations.
 *
 * @author Arni Arent
 *
 */
export abstract class EntitySystem implements EntityObserver {
    public static blackBoard: BlackBoard = new BlackBoard();
    private systemIndex_: number;

    public world: World;

    private actives_: Bag<Entity>;

    private aspect_: Aspect;

    private allSet_: BitSet;
    private exclusionSet_: BitSet;
    private oneSet_: BitSet;

    private passive_: boolean;

    private dummy_: boolean;

    /**
     * Creates an entity system that uses the specified aspect as a matcher against entities.
     * @param aspect to match against entities
     */
    constructor(aspect: Aspect) {
        this.actives_ = new Bag<Entity>();
        this.aspect_ = aspect;
        this.systemIndex_ = SystemIndexManager.getIndexFor(this.constructor);
        this.allSet_ = aspect.getAllSet();
        this.exclusionSet_ = aspect.getExclusionSet();
        this.oneSet_ = aspect.getOneSet();
        this.dummy_ = this.allSet_.isEmpty() && this.oneSet_.isEmpty(); // This system can't possibly be interested in any entity, so it must be "dummy"
    }

    /**
     * Called before processing of entities begins.
     */
    protected abstract begin(): void;

    public process(): void {
        if (this.checkProcessing()) {
            this.begin();
            this.processEntities(this.actives_);
            this.end();
        }
    }

    /**
     * Called after the processing of entities ends.
     */
    protected abstract end(): void;

    /**
     * Any implementing entity system must implement this method and the logic
     * to process the given entities of the system.
     *
     * @param entities the entities this system contains.
     */
    protected abstract processEntities(entities: ImmutableBag<Entity>);

    /**
     *
     * @return true if the system should be processed, false if not.
     */
    protected checkProcessing(): boolean {
        return true;
    }

    /**
     * Override to implement code that gets executed when systems are initialized.
     */
    public abstract initialize(): void;

    /**
     * Called if the system has received a entxity it is interested in, e.g. created or a component was added to it.
     * @param e the entity that was added to this system.
     */
    public abstract inserted(e: Entity): void;

    /**
     * Called if a entity was removed from this system, e.g. deleted or had one of it's components removed.
     * @param e the entity that was removed from this system.
     */
    protected abstract removed(e: Entity): void;

    /**
     * Will check if the entity is of interest to this system.
     * @param e entity to check
     */
    protected check(e: Entity): void {
        if (this.dummy_) {
            return;
        }

        const contains: boolean = e.getSystemBits().get(this.systemIndex_);
        let interested = true; // possibly interested, let's try to prove it wrong.

        const componentBits: BitSet = e.getComponentBits();

        // Check if the entity possesses ALL of the components defined in the aspect.
        if (!this.allSet_.isEmpty()) {
            for (let i = this.allSet_.nextSetBit(0); i >= 0; i = this.allSet_.nextSetBit(i + 1)) {
                if (!componentBits.get(i)) {
                    interested = false;
                    break;
                }
            }
        }

        // Check if the entity possesses ANY of the exclusion components, if it does then the system is not interested.
        if (!this.exclusionSet_.isEmpty() && interested) {
            interested = !this.exclusionSet_.intersects(componentBits);
        }

        // Check if the entity possesses ANY of the components in the oneSet. If so, the system is interested.
        if (!this.oneSet_.isEmpty()) {
            interested = this.oneSet_.intersects(componentBits);
        }

        if (interested && !contains) {
            this.insertToSystem(e);
        } else if (!interested && contains) {
            this.removeFromSystem(e);
        }
    }

    private removeFromSystem(e: Entity): void {
        this.actives_.remove(e);
        e.getSystemBits().clear(this.systemIndex_);
        this.removed(e);
    }

    private insertToSystem(e: Entity): void {
        this.actives_.add(e);
        e.getSystemBits().set(this.systemIndex_);
        this.inserted(e);
    }

    public added(e: Entity): void {
        this.check(e);
    }

    public changed(e: Entity): void {
        this.check(e);
    }

    public deleted(e: Entity): void {
        if (e.getSystemBits().get(this.systemIndex_)) {
            this.removeFromSystem(e);
        }
    }

    public disabled(e: Entity): void {
        if (e.getSystemBits().get(this.systemIndex_)) {
            this.removeFromSystem(e);
        }
    }

    public enabled(e: Entity): void {
        this.check(e);
    }

    public setWorld(world: World): void {
        this.world = world;
    }

    public isPassive(): boolean {
        return this.passive_;
    }

    public setPassive(passive: boolean): void {
        this.passive_ = passive;
    }

    public getActive(): ImmutableBag<Entity> {
        return this.actives_;
    }
}
