import {Manager} from "./../core/Manager";
import {Entity} from "./../core/Entity";
import {HashMap} from "./../utils/HashMap";
import {Map} from "./../utils/Map";
/**
 * If you need to tag any entity, use this. A typical usage would be to tag
 * entities such as "PLAYER", "BOSS" or something that is very unique.
 *
 * @author Arni Arent
 *
 */
export class TagManager extends Manager {
    private entitiesByTag_:Map<String, Entity>;
    private tagsByEntity_:Map<Entity, String>;

    constructor() {
        super();
        this.entitiesByTag_ = new HashMap<String, Entity>();
        this.tagsByEntity_ = new HashMap<Entity, String>();
    }

    public register(tag:string, e:Entity) {
        this.entitiesByTag_.put(tag, e);
        this.tagsByEntity_.put(e, tag);
    }

    public unregister(tag:string) {
        this.tagsByEntity_.remove(this.entitiesByTag_.remove(tag));
    }

    public isRegistered(tag:string):boolean {
        return this.entitiesByTag_.containsKey(tag);
    }

    public getEntity(tag:string):Entity {
        return this.entitiesByTag_.get(tag);
    }

    public getRegisteredTags():string[] {
        return this.tagsByEntity_.values();
    }


    public deleted(e:Entity) {
        var removedTag:string = this.tagsByEntity_.remove(e);
        if (removedTag != null) {
            this.entitiesByTag_.remove(removedTag);
        }
    }


    public initialize() {
    }

}