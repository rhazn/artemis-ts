import {Class} from "./../prolog";
/**
 * Mapper artemis.component.Position
 * em:ComponentMapper<artemis.component.Position>;
 *
 */
export function Mapper(component:Class) {
    return function (target:Object, propertyKey?:string, descriptor?:TypedPropertyDescriptor<any>) {

        var klass:any = target.constructor;

        klass.declaredFields = klass.declaredFields || [];
        klass.declaredFields.push(propertyKey);

        klass.prototype[propertyKey] = component;
    }
}


