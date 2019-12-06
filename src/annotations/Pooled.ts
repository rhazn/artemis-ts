import {Class, getClassName} from "./../prolog";
/**
 * Mapper artemis.component.Position
 * em:ComponentMapper<artemis.component.Position>;
 *
 */
export function Pooled() {
    return function(klass: Class): void {
        Pooled["pooledComponents"] = Pooled["pooledComponents"] || {};
        Pooled["pooledComponents"][getClassName(klass)] = klass;
    };
}
Pooled["pooledComponents"] = {};
