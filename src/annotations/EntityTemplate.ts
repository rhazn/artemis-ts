import {Class} from "./../prolog";
/**
 * EntityTemplate
 *
 */
export function EntityTemplate(component: string) {
    return function(target: Class): void {
        EntityTemplate["entityTemplates"] = EntityTemplate["entityTemplates"] || {};

        EntityTemplate["entityTemplates"][component] = target;
    };
}
