import {ComponentType} from "./ComponentType";
import {SystemIndexManager} from "./EntitySystem";

export class Artemis {
    /**
     * Because Artemis works with static indices for Component and Systems it needs to be resetted
     * before showing a new game instance.
     */
    public static resetGlobalState(): void {
        ComponentType.INDEX = 0;
        SystemIndexManager.INDEX = 0;
    }
}
