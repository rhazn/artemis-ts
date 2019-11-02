import {Entity} from "./Entity";
export interface EntityObserver {
    added(e: Entity);

    changed(e: Entity);

    deleted(e: Entity);

    enabled(e: Entity);

    disabled(e: Entity);
}
