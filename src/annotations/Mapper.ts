import {Class} from "./../prolog";
/**
 * Mapper artemis.component.Position
 * em:ComponentMapper<artemis.component.Position>;
 *
 */
export function Mapper(component: Class) {
    return function(target: Record<string, any>, propertyKey?: string) {
        const klass: any = target.constructor;

        klass.declaredFields = klass.declaredFields || [];
        klass.declaredFields.push(propertyKey);

        klass.prototype[propertyKey] = component;
    };
}
