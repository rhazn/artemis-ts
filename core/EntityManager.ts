import {Manager} from "./Manager";
import {Bag} from "../utils/Bag";
import {Entity} from "./Entity";
import {BitSet} from "../utils/BitSet";
export class EntityManager extends Manager {
    private entities_:Bag<Entity>;
    private disabled_:BitSet;

    private active_:number;
    private added_:number;
    private created_:number;
    private deleted_:number;

    private identifierPool_:IdentifierPool;

    constructor() {
        super();
        this.entities_ = new Bag<Entity>();
        this.disabled_ = new BitSet();
        this.identifierPool_ = new IdentifierPool();
        this.active_ = 0;
        this.added_ = 0;
        this.created_ = 0;
        this.deleted_ = 0;
    }


    public initialize() {
    }

    public createEntityInstance(name?:string):Entity {
        var e:Entity = new Entity(this.world_, this.identifierPool_.checkOut(), name);
        this.created_++;
        return e;
    }


    public added(e:Entity) {
        this.active_++;
        this.added_++;
        this.entities_.set(e.getId(), e);
    }


    public enabled(e:Entity) {
        this.disabled_.clear(e.getId());
    }


    public disabled(e:Entity) {
        this.disabled_.set(e.getId());
    }


    public deleted(e:Entity) {
        this.entities_.set(e.getId(), null);

        this.disabled_.clear(e.getId());

        this.identifierPool_.checkIn(e.getId());

        this.active_--;
        this.deleted_++;
    }


    /**
     * Check if this entity is active.
     * Active means the entity is being actively processed.
     *
     * @param entityId
     * @return true if active, false if not.
     */
    public isActive(entityId:number):boolean {
        return this.entities_.get(entityId) != null;
    }

    /**
     * Check if the specified entityId is enabled.
     *
     * @param entityId
     * @return true if the entity is enabled, false if it is disabled.
     */
    public isEnabled(entityId:number):boolean {
        return !this.disabled_.get(entityId);
    }

    /**
     * Get a entity with this id.
     *
     * @param entityId
     * @return the entity
     */
    public getEntity(entityId:number):Entity {
        return this.entities_.get(entityId);
    }

    /**
     * Get how many entities are active in this world.
     * @return how many entities are currently active.
     */
    public getActiveEntityCount():number {
        return this.active_;
    }

    /**
     * Get how many entities have been created in the world since start.
     * Note: A created entity may not have been added to the world, thus
     * created count is always equal or larger than added count.
     * @return how many entities have been created since start.
     */
    public getTotalCreated():number {
        return this.created_;
    }

    /**
     * Get how many entities have been added to the world since start.
     * @return how many entities have been added.
     */
    public getTotalAdded():number {
        return this.added_;
    }

    /**
     * Get how many entities have been deleted from the world since start.
     * @return how many entities have been deleted since start.
     */
    public getTotalDeleted():number {
        return this.deleted_;
    }


}
/*
 * Used only internally to generate distinct ids for entities and reuse them.
 */
class IdentifierPool {
    private ids_:Bag<number>;
    private nextAvailableId_:number = 0;

    constructor() {
        this.ids_ = new Bag<number>();
    }

    public checkOut():number {
        if (this.ids_.size() > 0) {
            return this.ids_.removeLast();
        }
        return this.nextAvailableId_++;
    }

    public checkIn(id:number) {
        this.ids_.add(id);
    }
}
