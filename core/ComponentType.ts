import {ComponentManager} from "./ComponentManager";
import {Class, getClassName} from "../prolog";
import {Pooled} from "../annotations/Pooled";
export enum Taxonomy {
    BASIC, POOLED,
}
export class ComponentType {
    public static INDEX:number = 0;
    public static componentManager:ComponentManager;

    private index_:number = 0;
    private type_:Class;
    private taxonomy_:Taxonomy;

    constructor(type:Class, index?:number) {
        if (index !== undefined) {
            this.index_ = ComponentType.INDEX++;
        } else {
            this.index_ = index;
        }
        this.type_ = type;
        if (Pooled['pooledComponents'][getClassName(type)] === type) {
            this.taxonomy_ = Taxonomy.POOLED;
        } else {
            this.taxonomy_ = Taxonomy.BASIC;
        }
    }

    public getName():string {
        return getClassName(this.type_);
    }

    public getIndex():number {
        return this.index_;
    }

    public getTaxonomy():Taxonomy {
        return this.taxonomy_;
    }

    public toString():string {
        return "ComponentType[" + getClassName(ComponentType) + "] (" + this.index_ + ")";
    }

}
