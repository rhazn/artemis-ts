import {BitSet} from "../utils/BitSet";
import {World} from "./World";
import {EntityManager} from "./EntityManager";
import {ComponentManager} from "./ComponentManager";
import {UUID} from "../utils/UUID";
import {Component} from "./Component";
import {ComponentTypeFactory} from "./ComponentTypeFactory";
import {ComponentType} from "./ComponentType";
import {Class} from "../prolog";
import {Bag} from "../utils/Bag";
/**
 * The entity class. Cannot be instantiated outside the framework, you must
 * create new entities using World.
 *
 * @author Arni Arent
 *
 */
export class Entity {
    public uuid:string;
    public name:string;

    private id_:number;
    private componentBits_:BitSet;
    private systemBits_:BitSet;

    private world_:World;
    private entityManager_:EntityManager;
    private componentManager_:ComponentManager;

    constructor(world:World, id:number, name?:string) {
        this.world_ = world;
        this.id_ = id;
        this.name = name;
        this.entityManager_ = world.getEntityManager();
        this.componentManager_ = world.getComponentManager();
        this.systemBits_ = new BitSet();
        this.componentBits_ = new BitSet();

        this.reset();
    }

    /**
     * The internal id for this entity within the framework. No other entity
     * will have the same ID, but ID's are however reused so another entity may
     * acquire this ID if the previous entity was deleted.
     *
     * @return id of the entity.
     */
    public getId():number {
        return this.id_;
    }

    /**
     * Returns a BitSet instance containing bits of the components the entity possesses.
     * @return
     */
    public getComponentBits():BitSet {
        return this.componentBits_;
    }

    /**
     * Returns a BitSet instance containing bits of the components the entity possesses.
     * @return
     */
    public getSystemBits():BitSet {
        return this.systemBits_;
    }

    /**
     * Make entity ready for re-use.
     * Will generate a new uuid for the entity.
     */
    protected reset() {
        this.systemBits_.clear();
        this.componentBits_.clear();
        this.uuid = UUID.randomUUID();
    }


    public toString():string {
        return "Entity[" + this.id_ + "]";
    }

    public createComponent<T extends Component>(componentKlazz, ...args:any[]):T {
        var componentManager:ComponentManager = this.world_.getComponentManager();
        var component:T = componentManager.create<T>(this, componentKlazz);
        if (args.length) {
            (<any>component).initialize(...args);
        }

        var tf:ComponentTypeFactory = this.world_.getComponentManager().typeFactory;
        var componentType:ComponentType = tf.getTypeFor(componentKlazz);
        this.componentBits_.set(componentType.getIndex());

        return component;

    }

    /**
     * Add a component to this entity.
     *
     * @param component to add to this entity
     *
     * @return this entity for chaining.
     */
    // public addComponent(component: Component):Entity {
    // 	this.addComponent(component, ComponentType.getTypeFor(component.getClass()));
    // 	return this;
    // }

    /**
     * Faster adding of components into the entity. Not neccessery to use this, but
     * in some cases you might need the extra performance.
     *
     * @param component the component to add
     * @param args of the component
     *
     * @return this entity for chaining.
     */
    //public addComponent(component:Component, type?:ComponentType):Entity {
    public addComponent(component:Component|Function, ...args:any[]):Entity {

        var type:ComponentType;
        if (component instanceof Component) {
            type = args[0];
        } else {
            component = this.createComponent(component, ...args);
            type = this.getTypeFor(component.constructor);
        }
        if (type === undefined)
            type = this.getTypeFor(component.constructor);

        //type = ComponentType.getTypeFor(component.constructor);
        this.componentManager_.addComponent(this, type, <Component>component);
        return this;
    }

    private getTypeFor(c) {
        return this.world_.getComponentManager().typeFactory.getTypeFor(c);
    }

    /**
     * Removes the component from this entity.
     *
     * @param component to remove from this entity.
     *
     * @return this entity for chaining.
     */
    public removeComponentInstance(component:Component):Entity {
        //this.removeComponent(ComponentType.getTypeFor(component.constructor));
        this.removeComponent(this.getTypeFor(component.constructor));
        return this;
    }

    /**
     * Faster removal of components from a entity.
     *
     * @param type to remove from this entity.
     *
     * @return this entity for chaining.
     */
    public removeComponent(type:ComponentType):Entity {
        this.componentManager_.removeComponent(this, type);
        return this;
    }

    /**
     * Remove component by its type.
     * @param type
     *
     * @return this entity for chaining.
     */
    public removeComponentByType(type:Class):Entity {
        //this.removeComponent(ComponentType.getTypeFor(type));
        this.removeComponent(this.getTypeFor(type));
        return this;
    }

    /**
     * Checks if the entity has been added to the world and has not been deleted from it.
     * If the entity has been disabled this will still return true.
     *
     * @return if it's active.
     */
    public isActive():boolean {
        return this.entityManager_.isActive(this.id_);
    }

    /**
     * Will check if the entity is enabled in the world.
     * By default all entities that are added to world are enabled,
     * this will only return false if an entity has been explicitly disabled.
     *
     * @return if it's enabled
     */
    public isEnabled():boolean {
        return this.entityManager_.isEnabled(this.id_);
    }

    /**
     * This is the preferred method to use when retrieving a component from a
     * entity. It will provide good performance.
     * But the recommended way to retrieve components from an entity is using
     * the ComponentMapper.
     *
     * @param type
     *            in order to retrieve the component fast you must provide a
     *            ComponentType instance for the expected component.
     * @return
     */
    public getComponent(type:ComponentType):Component {
        return this.componentManager_.getComponent(this, type);
    }

    // public <T extends Component> T getComponent(Class<T> type) {
    // 	return type.cast(getComponent(ComponentType.getTypeFor(type)));
    // }

    /**
     * Slower retrieval of components from this entity. Minimize usage of this,
     * but is fine to use e.g. when creating new entities and setting data in
     * components.
     *
     * @param <T>
     *            the expected return component type.
     * @param type
     *            the expected return component type.
     * @return component that matches, or null if none is found.
     */
    public getComponentByType(type:Class):Component {
        return this.componentManager_.getComponent(this, this.getTypeFor(type));
        //return this.componentManager_.getComponent(this, ComponentType.getTypeFor(type));
    }

    /**
     * Returns a bag of all components this entity has.
     * You need to reset the bag yourself if you intend to fill it more than once.
     *
     * @param fillBag the bag to put the components into.
     * @return the fillBag with the components in.
     */
    public getComponents(fillBag:Bag<Component>):Bag<Component> {
        return this.componentManager_.getComponentsFor(this, fillBag);
    }

    /**
     * Refresh all changes to components for this entity. After adding or
     * removing components, you must call this method. It will update all
     * relevant systems. It is typical to call this after adding components to a
     * newly created entity.
     */
    public addToWorld() {
        this.world_.addEntity(this);
    }

    /**
     * This entity has changed, a component added or deleted.
     */
    public changedInWorld() {
        this.world_.changedEntity(this);
    }

    /**
     * Delete this entity from the world.
     */
    public deleteFromWorld() {
        this.world_.deleteEntity(this);
    }

    /**
     * (Re)enable the entity in the world, after it having being disabled.
     * Won't do anything unless it was already disabled.
     */
    public enable() {
        this.world_.enable(this);
    }

    /**
     * Disable the entity from being processed. Won't delete it, it will
     * continue to exist but won't get processed.
     */
    public disable() {
        this.world_.disable(this);
    }

    /**
     * Get the UUID for this entity.
     * This UUID is unique per entity (re-used entities get a new UUID).
     * @return uuid instance for this entity.
     */
    public getUuid():UUID {
        return this.uuid;
    }

    /**
     * Returns the world this entity belongs to.
     * @return world of entity.
     */
    public getWorld():World {
        return this.world_;
    }
}