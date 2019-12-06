import {Trigger} from "./Trigger";
import {BlackBoard} from "./BlackBoard";
import {TriggerStateType} from "./TriggerStateType";

export class SimpleTrigger extends Trigger {
    /** The condition. */
    private condition: (b: BlackBoard, t: TriggerStateType) => boolean;

    /** The onFire event. */
    protected onFire: (t: TriggerStateType) => void;

    /**
     * Initializes a new instance of the SimpleTrigger class.
     *
     * @param name  The name.
     * @param condition The condition.
     * @param onFire  The event.
     */
    constructor(
        name: string,
        condition: (b: BlackBoard, t: TriggerStateType) => boolean,
        onFire: (t: TriggerStateType) => void,
    ) {
        super([name]);
        this.condition = condition;
        this.onFire = onFire;
    }

    /**
     * Called if is fired.
     * @param triggerStateType  State of the trigger.
     */
    protected calledOnFire(triggerStateType: TriggerStateType): void {
        if (this.onFire !== null) {
            this.onFire(triggerStateType);
        }
    }

    /**
     * Checks the condition to fire.
     * @returns {boolean} if XXXX, false otherwise
     */
    protected checkConditionToFire(): boolean {
        return this.condition(this.blackboard, this.triggerStateType);
    }
}
