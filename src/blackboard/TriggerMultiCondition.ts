import {TriggerStateType} from "./TriggerStateType";
import {BlackBoard} from "./BlackBoard";
import {Trigger} from "./Trigger";

export class TriggerMultiCondition extends Trigger {
    /** The condition. */
    private condition: (b: BlackBoard, t: TriggerStateType) => boolean;

    /** The onFire event. */
    protected onFire: (t: TriggerStateType) => void;

    /**
     * Initializes a new instance of the SimpleTrigger class.
     *
     * @param condition The condition.
     * @param onFire  The event.
     * @param names  The names.
     */
    constructor(
        condition: (b: BlackBoard, t: TriggerStateType) => boolean,
        onFire: (t: TriggerStateType) => void,
        names: string[],
    ) {
        super(names);
        this.condition = condition;
        this.onFire = onFire;
    }

    /**
     * Removes the this trigger.
     */
    public removeThisTrigger(): void {
        this.blackboard.removeTrigger(this);
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
