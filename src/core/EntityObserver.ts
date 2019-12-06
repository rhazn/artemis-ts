import {Entity} from "./Entity";

export interface EntityObserver {
    added(e: Entity): void;

    changed(e: Entity): void;

    deleted(e: Entity): void;

    enabled(e: Entity): void;

    disabled(e: Entity): void;
}
