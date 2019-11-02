import {Class, getClassName} from "./../prolog";
/**
 * Mapper artemis.component.Position
 * em:ComponentMapper<artemis.component.Position>;
 *
 */
export function Pooled() {
    return function (klass:Class, propertyKey?:string, descriptor?:TypedPropertyDescriptor<any>) {

        Pooled['pooledComponents'] = Pooled['pooledComponents'] || {};
        Pooled['pooledComponents'][getClassName(klass)] = klass;

    }
}
Pooled['pooledComponents'] = {};


