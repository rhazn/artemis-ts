import {Manager} from "./../core/Manager";
import {Bag} from "./../utils/Bag";
import {Map} from "./../utils/Map";
import {Entity} from "./../core/Entity";
import {HashMap} from "./../utils/HashMap";
import {ImmutableBag} from "./../utils/ImmutableBag";
/**
 * If you need to group your entities together, e.g. tanks going into "units" group or explosions into "effects",
 * then use this manager. You must retrieve it using world instance.
 *
 * A entity can be assigned to more than one group.
 *
 * @author Arni Arent
 *
 */
export class GroupManager extends Manager {
    private entitiesByGroup_: Map<string, Bag<Entity>>;
    private groupsByEntity_: Map<Entity, Bag<string>>;

    constructor() {
        super();
        this.entitiesByGroup_ = new HashMap<string, Bag<Entity>>();
        this.groupsByEntity_ = new HashMap<Entity, Bag<string>>();
    }

    public initialize() {}

    /**
     * Set the group of the entity.
     *
     * @param group group to add the entity into.
     * @param e entity to add into the group.
     */
    public add(e: Entity, group: string) {
        let entities: Bag<Entity> = this.entitiesByGroup_.get(group);
        if (entities == null) {
            entities = new Bag<Entity>();
            this.entitiesByGroup_.put(group, entities);
        }
        entities.add(e);

        let groups: Bag<string> = this.groupsByEntity_.get(e);
        if (groups == null) {
            groups = new Bag<string>();
            this.groupsByEntity_.put(e, groups);
        }
        groups.add(group);
    }

    /**
     * Remove the entity from the specified group.
     * @param e
     * @param group
     */
    public remove(e: Entity, group: string) {
        const entities: Bag<Entity> = this.entitiesByGroup_.get(group);
        if (entities != null) {
            entities.remove(e);
        }

        const groups: Bag<string> = this.groupsByEntity_.get(e);
        if (groups != null) {
            groups.remove(group);
        }
    }

    public removeFromAllGroups(e: Entity) {
        const groups: Bag<string> = this.groupsByEntity_.get(e);
        if (groups != null) {
            for (let i = 0, s = groups.size(); s > i; i++) {
                const entities: Bag<Entity> = this.entitiesByGroup_.get(groups.get(i));
                if (entities != null) {
                    entities.remove(e);
                }
            }
            groups.clear();
        }
    }

    /**
     * Get all entities that belong to the provided group.
     * @param group name of the group.
     * @return read-only bag of entities belonging to the group.
     */
    public getEntities(group: string): ImmutableBag<Entity> {
        let entities: Bag<Entity> = this.entitiesByGroup_.get(group);
        if (entities == null) {
            entities = new Bag<Entity>();
            this.entitiesByGroup_.put(group, entities);
        }
        return entities;
    }

    /**
     * @param e entity
     * @return the groups the entity belongs to, null if none.
     */
    public getGroups(e: Entity): ImmutableBag<string> {
        return this.groupsByEntity_.get(e);
    }

    /**
     * Checks if the entity belongs to any group.
     * @param e the entity to check.
     * @return true if it is in any group, false if none.
     */
    public isInAnyGroup(e: Entity): boolean {
        return this.getGroups(e) != null;
    }

    /**
     * Check if the entity is in the supplied group.
     * @param group the group to check in.
     * @param e the entity to check for.
     * @return true if the entity is in the supplied group, false if not.
     */
    public isInGroup(e: Entity, group: string): boolean {
        if (group != null) {
            const groups: Bag<string> = this.groupsByEntity_.get(e);
            for (let i = 0, s = groups.size(); s > i; i++) {
                const g: string = groups.get(i);
                if (group === g) {
                    return true;
                }
            }
        }
        return false;
    }

    public deleted(e: Entity) {
        this.removeFromAllGroups(e);
    }
}
