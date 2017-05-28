import {Manager} from "../core/Manager";
import {Entity} from "../core/Entity";
import {Bag} from "../utils/Bag";
import {Map} from "../utils/Map";
import {HashMap} from "../utils/HashMap";
import {ImmutableBag} from "../utils/ImmutableBag";
/**
 * You may sometimes want to specify to which player an entity belongs to.
 *
 * An entity can only belong to a single player at a time.
 *
 * @author Arni Arent
 *
 */
export class PlayerManager extends Manager {
    private playerByEntity_:Map<Entity, String>;
    private entitiesByPlayer_:Map<String, Bag<Entity>>;

    constructor() {
        super();
        this.playerByEntity_ = new HashMap<Entity, String>();
        this.entitiesByPlayer_ = new HashMap<String, Bag<Entity>>();
    }

    public setPlayer(e:Entity, player:string) {
        this.playerByEntity_.put(e, player);
        var entities:Bag<Entity> = this.entitiesByPlayer_.get(player);
        if (entities == null) {
            entities = new Bag<Entity>();
            this.entitiesByPlayer_.put(player, entities);
        }
        entities.add(e);
    }

    public getEntitiesOfPlayer(player:string):ImmutableBag<Entity> {
        var entities:Bag<Entity> = this.entitiesByPlayer_.get(player);
        if (entities == null) {
            entities = new Bag<Entity>();
        }
        return entities;
    }

    public removeFromPlayer(e:Entity) {
        var player:string = this.playerByEntity_.get(e);
        if (player !== null) {
            var entities:Bag<Entity> = this.entitiesByPlayer_.get(player);
            if (entities !== null) {
                entities.remove(e);
            }
        }
    }

    public getPlayer(e:Entity) {
        return this.playerByEntity_.get(e);
    }


    public initialize() {
    }


    public deleted(e:Entity) {
        this.removeFromPlayer(e);
    }

}
