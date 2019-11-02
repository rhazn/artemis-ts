import {Manager} from "./Manager";
import {Bag} from "./../utils/Bag";
import {Component} from "./Component";
import {ComponentPool} from "./ComponentPool";
import {Entity} from "./Entity";
import {ComponentTypeFactory} from "./ComponentTypeFactory";
import {Class} from "./../prolog";
import {ComponentType, Taxonomy} from "./ComponentType";
import {PooledComponent} from "./PooledComponent";
import {BitSet} from "./../utils/BitSet";
export class ComponentManager extends Manager {
    private componentsByType_: Bag<Bag<Component>>;
    private pooledComponents_: ComponentPool;
    private deleted_: Bag<Entity>;
    public typeFactory: ComponentTypeFactory;

    constructor() {
        super();
        this.componentsByType_ = new Bag<Bag<Component>>();
        this.pooledComponents_ = new ComponentPool();
        this.deleted_ = new Bag<Entity>();

        this.typeFactory = new ComponentTypeFactory();
    }

    public initialize() {}

    create<T extends Component>(owner: Entity, componentClass: Class): T {
        const type: ComponentType = this.typeFactory.getTypeFor(componentClass);
        let component: T = null;

        switch (type.getTaxonomy()) {
            case Taxonomy.BASIC:
                //console.log('create BASIC');
                component = <T>this.newInstance(componentClass, false);
                break;
            case Taxonomy.POOLED:
                //console.log('create POOLED');
                this.reclaimPooled(owner, type);
                /**
                 * YUK! <T> is not working here.
                 * It should be ok, since it will be the same as 'type'
                 */
                component = <any>this.pooledComponents_.obtain(componentClass, type);
                break;
            default:
                throw new Error(
                    "InvalidComponentException unknown component type:" + type.getTaxonomy(),
                );
        }
        this.addComponent(owner, type, component);
        return component;
    }

    private reclaimPooled(owner: Entity, type: ComponentType) {
        const components: Bag<Component> = this.componentsByType_.safeGet(type.getIndex());
        if (components == null) return;
        const old: Component = components.safeGet(owner.getId());
        if (old !== undefined && old !== null) {
            this.pooledComponents_.free(<PooledComponent>old, type);
        }
    }

    newInstance<T extends Component>(constructor, constructorHasWorldParameter: boolean): T {
        if (constructorHasWorldParameter) {
            return <T>new constructor(this.world_);
        } else {
            return <T>new constructor();
        }
    }

    /**
     * Removes all components from the entity associated in this manager.
     *
     * @param e
     *            the entity to remove components from
     */
    private removeComponentsOfEntity(e: Entity) {
        const componentBits: BitSet = e.getComponentBits();
        for (let i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
            switch (this.typeFactory.getTaxonomy(i)) {
                case Taxonomy.BASIC:
                    //console.log('remove BASIC');
                    this.componentsByType_.get(i).set(e.getId(), null);
                    break;

                case Taxonomy.POOLED:
                    //console.log('remove POOLED');
                    var pooled: Component = this.componentsByType_.get(i).get(e.getId());
                    this.pooledComponents_.freeByIndex(<PooledComponent>pooled, i);
                    this.componentsByType_.get(i).set(e.getId(), null);
                    break;

                default:
                    throw new Error(
                        "InvalidComponentException" +
                            " unknown component type: " +
                            this.typeFactory.getTaxonomy(i),
                    );
            }
        }
        componentBits.clear();
    }

    /**
     * Adds the component of the given type to the entity.
     * <p>
     * Only one component of given type can be associated with a entity at the
     * same time.
     * </p>
     *
     * @param e
     *            the entity to add to
     * @param type
     *            the type of component being added
     * @param component
     *            the component to add
     */
    public addComponent(e: Entity, type: ComponentType, component: Component) {
        this.componentsByType_.ensureCapacity(type.getIndex());

        let components: Bag<Component> = this.componentsByType_.get(type.getIndex());
        if (components == null) {
            components = new Bag<Component>();
            this.componentsByType_.set(type.getIndex(), components);
        }

        components.set(e.getId(), component);

        e.getComponentBits().set(type.getIndex());
    }

    /**
     * Removes the component of given type from the entity.
     *
     * @param e
     *            the entity to remove from
     * @param type
     *            the type of component being removed
     */
    public removeComponent(e: Entity, type: ComponentType) {
        const index = type.getIndex();
        switch (type.getTaxonomy()) {
            case Taxonomy.BASIC:
                this.componentsByType_.get(index).set(e.getId(), null);
                e.getComponentBits().clear(type.getIndex());
                break;
            case Taxonomy.POOLED:
                var pooled: Component = this.componentsByType_[index][e.getId()];
                e.getComponentBits().clear(type.getIndex());
                this.pooledComponents_.free(<PooledComponent>pooled, type);
                this.componentsByType_.get(index).set(e.getId(), null);
                break;
            default:
                throw new Error(
                    "InvalidComponentException" +
                        type +
                        " unknown component type: " +
                        type.getTaxonomy(),
                );
        }
    }

    /**
     * Get all components from all entities for a given type.
     *
     * @param type
     *            the type of components to get
     * @return a bag containing all components of the given type
     */
    public getComponentsByType(type: ComponentType): Bag<Component> {
        let components: Bag<Component> = this.componentsByType_.get(type.getIndex());
        if (components == null) {
            components = new Bag<Component>();
            this.componentsByType_.set(type.getIndex(), components);
        }
        return components;
    }

    /**
     * Get a component of an entity.
     *
     * @param e
     *            the entity associated with the component
     * @param type
     *            the type of component to get
     * @return the component of given type
     */
    public getComponent(e: Entity, type: ComponentType): Component {
        const components: Bag<Component> = this.componentsByType_.get(type.getIndex());
        if (components != null) {
            return components.get(e.getId());
        }
        return null;
    }

    /**
     * Get all component associated with an entity.
     *
     * @param e
     *            the entity to get components from
     * @param fillBag
     *            a bag to be filled with components
     * @return the {@code fillBag}, filled with the entities components
     */
    public getComponentsFor(e: Entity, fillBag: Bag<Component>): Bag<Component> {
        const componentBits: BitSet = e.getComponentBits();

        for (let i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
            fillBag.add(this.componentsByType_.get(i)[e.getId()]);
        }

        return fillBag;
    }

    public deleted(e: Entity) {
        this.deleted_.add(e);
    }

    public clean() {
        if (this.deleted_.size() > 0) {
            for (let i = 0; this.deleted_.size() > i; i++) {
                this.removeComponentsOfEntity(this.deleted_.get(i));
            }
            this.deleted_.clear();
        }
    }
}
